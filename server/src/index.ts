import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { prisma } from "./prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";

const app = express();

// Security & middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan(isProduction ? "combined" : "dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProduction ? 100 : 1000,
    message: { error: "Too many requests" },
  })
);
const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: corsOrigin ? corsOrigin.split(",").map((o) => o.trim()) : true,
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, data: { ok: true, db: "connected" } });
  } catch {
    res.status(503).json({ success: false, error: { code: "DB_ERROR", message: "Database disconnected" } });
  }
});

app.get("/api/hospitals", async (_req, res) => {
  const hospitals = await prisma.hospital.findMany({ orderBy: { id: "asc" } });
  res.json({
    success: true,
    data: hospitals.map((h) => ({
      id: h.id,
      name: h.name,
      distance: `${h.distanceKm.toFixed(1)} km`,
      fees: h.fees,
      beds: { free: h.bedsFree, occupied: h.bedsOccupied, cleaning: h.bedsCleaning },
      waitingTime: `${h.waitingMins} min`,
      rating: h.rating,
      image: h.imageUrl
    }))
  });
});

app.get("/api/hospitals/:id/doctors", async (req, res) => {
  const hospitalId = Number(req.params.id);
  if (!Number.isFinite(hospitalId)) return res.status(400).json({ success: false, error: { code: "INVALID_ID", message: "Invalid hospital id" } });

  const doctors = await prisma.doctor.findMany({
    where: { hospitalId },
    orderBy: { id: "asc" }
  });

  res.json({
    success: true,
    data: doctors.map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      experience: d.experience,
      rating: d.rating,
      availableSlots: JSON.parse(d.slotsJson) as string[],
      image: d.imageUrl,
      hospitalId: d.hospitalId
    }))
  });
});

// All doctors (frontend can filter by hospitalId)
app.get("/api/doctors", async (_req, res) => {
  const doctors = await prisma.doctor.findMany({ orderBy: { id: "asc" } });
  res.json({
    success: true,
    data: doctors.map((d) => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      experience: d.experience,
      rating: d.rating,
      availableSlots: JSON.parse(d.slotsJson) as string[],
      image: d.imageUrl,
      hospitalId: d.hospitalId
    }))
  });
});

const createAppointmentSchema = z.object({
  patientName: z.string().min(1),
  symptoms: z.string().min(1),
  hospitalId: z.number().int().positive(),
  doctorId: z.number().int().positive(),
  slot: z.string().min(1)
});

app.post("/api/appointments", async (req, res) => {
  const parsed = createAppointmentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.issues } });

  const { patientName, symptoms, hospitalId, doctorId, slot } = parsed.data;

  // Create a lightweight patient record if one doesn't exist yet
  const patient = await prisma.patient.upsert({
    where: { name: patientName },
    update: {},
    create: {
      name: patientName,
      age: 30,
      gender: "Unknown",
      imageUrl:
        "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=1080&q=80",
      medicalHistoryJson: JSON.stringify([]),
      pastMedicinesJson: JSON.stringify([]),
      aiSummary: null
    }
  });

  const appointment = await prisma.appointment.create({
    data: {
      patientName,
      symptoms,
      hospitalId,
      doctorId,
      slot,
      status: "confirmed",
      AppointmentPatient: { create: { patientId: patient.id } }
    },
    include: {
      hospital: true,
      doctor: true
    }
  });

  res.status(201).json({
    success: true,
    data: {
      id: appointment.id,
      status: appointment.status,
      hospitalName: appointment.hospital.name,
      doctorName: appointment.doctor.name,
      slot: appointment.slot
    }
  });
});

// Doctor dashboard
app.get("/api/doctor/patients", async (_req, res) => {
  const appts = await prisma.appointment.findMany({
    orderBy: { id: "asc" },
    include: {
      doctor: true,
      hospital: true,
      consultation: true,
      AppointmentPatient: { include: { patient: true } }
    }
  });

  res.json({
    success: true,
    data: appts.map((a) => {
      const link = a.AppointmentPatient?.[0];
      const patient = link?.patient;
      return {
        id: a.id,
        name: patient?.name ?? a.patientName,
        age: patient?.age ?? 30,
        gender: patient?.gender ?? "Unknown",
        disease: "General Consultation",
        message: a.symptoms,
        appointmentTime: a.slot,
        status: a.consultation ? "completed" : "waiting",
        image: patient?.imageUrl ?? "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=1080&q=80",
        medicalHistory: patient ? (JSON.parse(patient.medicalHistoryJson) as string[]) : [],
        pastMedicines: patient ? (JSON.parse(patient.pastMedicinesJson) as string[]) : [],
        aiSummary: patient?.aiSummary ?? undefined
      };
    })
  });
});

const saveConsultationSchema = z.object({
  appointmentId: z.number().int().positive(),
  diagnosis: z.string().min(1),
  prescription: z.string().min(1),
  notes: z.string().optional().default("")
});

app.post("/api/doctor/consultations", async (req, res) => {
  const parsed = saveConsultationSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid payload", details: parsed.error.issues } });

  const { appointmentId, diagnosis, prescription, notes } = parsed.data;

  const exists = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!exists) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Appointment not found" } });

  const consultation = await prisma.consultation.upsert({
    where: { appointmentId },
    update: { diagnosis, prescription, notes },
    create: { appointmentId, diagnosis, prescription, notes }
  });

  res.status(201).json({ success: true, data: { ok: true, id: consultation.id } });
});

// Admin dashboard
app.get("/api/admin/dashboard", async (_req, res) => {
  const [patientsCount, activeConsultations, lowStockAlerts, hospitalsCount, doctorsCount] = await Promise.all([
    prisma.patient.count(),
    prisma.consultation.count(),
    prisma.medicine.count({ where: { OR: [{ status: "low" }, { status: "critical" }] } }),
    prisma.hospital.count(),
    prisma.doctor.count()
  ]);

  const [diseaseTrendData, medicineStock, monthlyRevenue, medicineUsageData] = await Promise.all([
    prisma.diseaseTrendPoint.findMany({ orderBy: { id: "asc" } }),
    prisma.medicine.findMany({ orderBy: { id: "asc" } }),
    prisma.revenuePoint.findMany({ orderBy: { id: "asc" } }),
    prisma.medicineUsagePoint.findMany({ orderBy: { id: "asc" } })
  ]);

  const latest = diseaseTrendData[diseaseTrendData.length - 1];
  const diseaseDistribution = latest
    ? [
      { name: "Seasonal Flu", value: latest.flu, color: "#3b82f6" },
      { name: "Hypertension", value: latest.hypertension, color: "#ef4444" },
      { name: "Diabetes", value: latest.diabetes, color: "#f59e0b" },
      { name: "COVID-19", value: latest.covid, color: "#8b5cf6" },
      { name: "Others", value: Math.max(0, Math.round((latest.flu + latest.diabetes + latest.hypertension + latest.covid) * 0.25)), color: "#10b981" }
    ]
    : [];

  res.json({
    success: true,
    data: {
      metrics: {
        totalPatients: patientsCount,
        activeConsultations,
        revenueJan: 620000,
        lowStockAlerts,
        hospitals: hospitalsCount,
        doctors: doctorsCount
      },
      diseaseTrendData,
      diseaseDistribution,
      medicineStock,
      monthlyRevenue,
      medicineUsageData
    }
  });
});

// 404 for unknown API routes (so they don't get SPA index.html)
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Not found" } });
  next();
});
// Serve frontend in production (single deploy)
if (isProduction) {
  const buildPath = path.join(__dirname, "../../../build");
  app.use(express.static(buildPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Global error handler (no stack trace in production)
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (isProduction) {
    res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: err.message, details: err.stack } });
  }
});

const port = Number(process.env.PORT ?? "4000");
app.listen(port, () => {
  if (!isProduction) {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
  }
});

