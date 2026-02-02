import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    // Idempotent-ish seed: only seed when tables are empty.
    const existingHospitals = await prisma.hospital.count();
    const existingPatients = await prisma.patient.count();
    const existingAdmin = await prisma.diseaseTrendPoint.count();
    if (existingHospitals > 0 && existingPatients > 0 && existingAdmin > 0)
        return;
    if (existingHospitals === 0) {
        await prisma.hospital.createMany({
            data: [
                {
                    name: "City Central Hospital",
                    distanceKm: 2.3,
                    fees: 500,
                    waitingMins: 15,
                    rating: 4.8,
                    imageUrl: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?auto=format&fit=crop&w=1080&q=80",
                    bedsFree: 12,
                    bedsOccupied: 45,
                    bedsCleaning: 3
                },
                {
                    name: "Green Valley Medical Center",
                    distanceKm: 3.8,
                    fees: 700,
                    waitingMins: 25,
                    rating: 4.9,
                    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1080&q=80",
                    bedsFree: 8,
                    bedsOccupied: 38,
                    bedsCleaning: 4
                },
                {
                    name: "MediCare Plus Hospital",
                    distanceKm: 1.5,
                    fees: 400,
                    waitingMins: 10,
                    rating: 4.7,
                    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1080&q=80",
                    bedsFree: 5,
                    bedsOccupied: 52,
                    bedsCleaning: 2
                }
            ]
        });
    }
    // Fetch IDs to attach doctors
    const allHospitals = await prisma.hospital.findMany({ orderBy: { id: "asc" } });
    const [h1, h2, h3] = allHospitals;
    const existingDoctors = await prisma.doctor.count();
    if (existingDoctors === 0) {
        await prisma.doctor.createMany({
            data: [
                {
                    name: "Dr. Michael Chen",
                    specialty: "General Physician",
                    experience: 15,
                    rating: 4.8,
                    imageUrl: "https://images.unsplash.com/photo-1758691463626-0ab959babe00?auto=format&fit=crop&w=1080&q=80",
                    slotsJson: JSON.stringify(["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"]),
                    hospitalId: h1.id
                },
                {
                    name: "Dr. Priya Sharma",
                    specialty: "General Medicine",
                    experience: 12,
                    rating: 4.9,
                    imageUrl: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?auto=format&fit=crop&w=1080&q=80",
                    slotsJson: JSON.stringify(["9:30 AM", "1:00 PM", "3:30 PM", "5:00 PM"]),
                    hospitalId: h1.id
                },
                {
                    name: "Dr. Rajesh Kumar",
                    specialty: "Internal Medicine",
                    experience: 18,
                    rating: 4.7,
                    imageUrl: "https://images.unsplash.com/photo-1758691463626-0ab959babe00?auto=format&fit=crop&w=1080&q=80",
                    slotsJson: JSON.stringify(["11:00 AM", "2:30 PM", "4:00 PM"]),
                    hospitalId: h1.id
                },
                {
                    name: "Dr. Lisa Wong",
                    specialty: "Cardiologist",
                    experience: 11,
                    rating: 4.8,
                    imageUrl: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1080&q=80",
                    slotsJson: JSON.stringify(["10:15 AM", "12:00 PM", "3:00 PM"]),
                    hospitalId: h2.id
                },
                {
                    name: "Dr. Amit Patel",
                    specialty: "Orthopedic",
                    experience: 14,
                    rating: 4.6,
                    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1080&q=80",
                    slotsJson: JSON.stringify(["9:00 AM", "11:45 AM", "1:30 PM", "6:00 PM"]),
                    hospitalId: h3.id
                }
            ]
        });
    }
    // Doctor dashboard demo patients (from existing UI mocks)
    if (existingPatients === 0) {
        await prisma.patient.createMany({
            data: [
                {
                    name: "Sarah Johnson",
                    age: 28,
                    gender: "Female",
                    imageUrl: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=1080&q=80",
                    medicalHistoryJson: JSON.stringify([
                        "Allergic to Penicillin",
                        "Had flu vaccine in 2025",
                        "No chronic conditions"
                    ]),
                    pastMedicinesJson: JSON.stringify(["Paracetamol 500mg", "Cetirizine 10mg", "Vitamin C"]),
                    aiSummary: "Patient presents with acute flu symptoms. History shows good response to standard flu treatment. No red flags. Recommended: Symptomatic treatment with rest and hydration."
                },
                {
                    name: "Rajesh Kumar",
                    age: 45,
                    gender: "Male",
                    imageUrl: "https://images.unsplash.com/photo-1650174378624-c9ab2c99e512?auto=format&fit=crop&w=1080&q=80",
                    medicalHistoryJson: JSON.stringify([
                        "Hypertension diagnosed 2023",
                        "Family history of heart disease",
                        "Non-smoker"
                    ]),
                    pastMedicinesJson: JSON.stringify(["Amlodipine 5mg", "Atorvastatin 10mg"]),
                    aiSummary: "Long-term hypertension patient with stable condition on current medication. BP trends show good control. Continue current regimen with regular monitoring."
                },
                {
                    name: "Priya Sharma",
                    age: 32,
                    gender: "Female",
                    imageUrl: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?auto=format&fit=crop&w=1080&q=80",
                    medicalHistoryJson: JSON.stringify([
                        "Chronic migraine since 2020",
                        "Stress-related triggers",
                        "No food allergies"
                    ]),
                    pastMedicinesJson: JSON.stringify(["Sumatriptan 50mg", "Propranolol 40mg"]),
                    aiSummary: "Chronic migraine patient with known stress triggers. Previous treatment shows moderate success. Consider lifestyle modifications and prophylactic therapy adjustment."
                },
                {
                    name: "Amit Patel",
                    age: 55,
                    gender: "Male",
                    imageUrl: "https://images.unsplash.com/photo-1650174378624-c9ab2c99e512?auto=format&fit=crop&w=1080&q=80",
                    medicalHistoryJson: JSON.stringify([
                        "Type 2 Diabetes diagnosed 2019",
                        "Overweight (BMI 28)",
                        "Sedentary lifestyle"
                    ]),
                    pastMedicinesJson: JSON.stringify(["Metformin 500mg", "Glimepiride 2mg"]),
                    aiSummary: "Diabetic patient with suboptimal glycemic control. Recent HbA1c suggests need for medication adjustment and lifestyle intervention. Referral to dietitian recommended."
                }
            ]
        });
    }
    // Create matching appointments (link to first hospital + first doctor for demo queue)
    const existingAppointments = await prisma.appointment.count();
    if (existingAppointments === 0) {
        const [doc1] = await prisma.doctor.findMany({ orderBy: { id: "asc" }, take: 1 });
        const [hospital1] = await prisma.hospital.findMany({ orderBy: { id: "asc" }, take: 1 });
        const allPatients = await prisma.patient.findMany({ orderBy: { id: "asc" } });
        const slots = ["10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM"];
        const symptoms = [
            "Severe headache and fever since yesterday",
            "Regular checkup for blood pressure monitoring",
            "Recurring migraine attacks, need pain management",
            "Blood sugar levels fluctuating, need consultation"
        ];
        for (let i = 0; i < Math.min(allPatients.length, 4); i++) {
            const p = allPatients[i];
            await prisma.appointment.create({
                data: {
                    patientName: p.name,
                    symptoms: symptoms[i],
                    slot: slots[i],
                    status: "confirmed",
                    hospitalId: hospital1.id,
                    doctorId: doc1.id,
                    AppointmentPatient: { create: { patientId: p.id } }
                }
            });
        }
    }
    // Admin dashboard demo data (from existing UI mocks)
    if (existingAdmin === 0) {
        await prisma.diseaseTrendPoint.createMany({
            data: [
                { month: "Aug", flu: 120, diabetes: 85, hypertension: 95, covid: 45 },
                { month: "Sep", flu: 135, diabetes: 88, hypertension: 98, covid: 38 },
                { month: "Oct", flu: 165, diabetes: 92, hypertension: 102, covid: 42 },
                { month: "Nov", flu: 198, diabetes: 96, hypertension: 105, covid: 35 },
                { month: "Dec", flu: 245, diabetes: 99, hypertension: 108, covid: 28 },
                { month: "Jan", flu: 280, diabetes: 103, hypertension: 112, covid: 32 }
            ]
        });
        await prisma.medicine.createMany({
            data: [
                { name: "Paracetamol 500mg", stock: 2450, price: 2.5, expiry: "Dec 2026", status: "good", reorderLevel: 500 },
                { name: "Amoxicillin 250mg", stock: 1820, price: 12.0, expiry: "Mar 2026", status: "good", reorderLevel: 500 },
                { name: "Metformin 500mg", stock: 380, price: 8.5, expiry: "Jun 2026", status: "low", reorderLevel: 500 },
                { name: "Amlodipine 5mg", stock: 1520, price: 15.0, expiry: "Sep 2026", status: "good", reorderLevel: 500 },
                { name: "Azithromycin 250mg", stock: 890, price: 18.5, expiry: "Aug 2026", status: "good", reorderLevel: 500 },
                { name: "Insulin Glargine", stock: 145, price: 125.0, expiry: "Feb 2026", status: "critical", reorderLevel: 200 }
            ]
        });
        await prisma.revenuePoint.createMany({
            data: [
                { month: "Aug", revenue: 450000, expenses: 320000 },
                { month: "Sep", revenue: 480000, expenses: 325000 },
                { month: "Oct", revenue: 510000, expenses: 340000 },
                { month: "Nov", revenue: 525000, expenses: 345000 },
                { month: "Dec", revenue: 580000, expenses: 360000 },
                { month: "Jan", revenue: 620000, expenses: 375000 }
            ]
        });
        await prisma.medicineUsagePoint.createMany({
            data: [
                { category: "Antibiotics", usage: 35, available: 65 },
                { category: "Analgesics", usage: 55, available: 45 },
                { category: "Diabetes", usage: 42, available: 58 },
                { category: "Cardiac", usage: 38, available: 62 },
                { category: "Respiratory", usage: 48, available: 52 }
            ]
        });
    }
    // keep seed deterministic
    void h1;
    void h2;
    void h3;
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
