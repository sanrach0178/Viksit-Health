import { Patient } from '../components/DoctorDashboard';

export const mockPatients: Patient[] = [
    // High Priority
    {
        id: 1,
        name: "Sarah Johnson",
        age: 28,
        gender: "Female",
        disease: "Severe Migraine",
        message: "Severe headache and fever since yesterday, light sensitivity.",
        appointmentTime: "10:30 AM",
        status: "waiting",
        priority: "high",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
        medicalHistory: ["Migraines", "Asthma"],
        pastMedicines: ["Sumatriptan", "Ibuprofen"],
        aiSummary: "Patient reports acute onset migraine with potential infection symptoms (fever). Prior history of migraines. Immediate assessment recommended."
    },
    {
        id: 2,
        name: "Robert Smith",
        age: 65,
        gender: "Male",
        disease: "Chest Pain",
        message: "Feeling tightness in chest and shortness of breath.",
        appointmentTime: "10:45 AM",
        status: "waiting",
        priority: "high",
        image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=800&q=80",
        medicalHistory: ["Hypertension", "Type 2 Diabetes"],
        pastMedicines: ["Metformin", "Lisinopril"],
        aiSummary: "Potential cardiac event. Risk factors include hypertension and diabetes. Urgent ECG and cardiac enzymes test advised."
    },

    // Medium Priority
    {
        id: 3,
        name: "Emily Davis",
        age: 34,
        gender: "Female",
        disease: "Seasonal Flu",
        message: "Cough, runny nose, and fatigue for 3 days.",
        appointmentTime: "11:15 AM",
        status: "waiting",
        priority: "medium",
        image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&w=800&q=80",
        medicalHistory: ["None"],
        pastMedicines: ["Multivitamins"],
        aiSummary: "Classic flu symptoms. Vitals stable. Symptomatic relief and rest recommended."
    },
    {
        id: 4,
        name: "Michael Brown",
        age: 45,
        gender: "Male",
        disease: "Back Pain",
        message: "Lower back pain worsening after lifting heavy boxes.",
        appointmentTime: "11:45 AM",
        status: "waiting",
        priority: "medium",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80",
        medicalHistory: ["Lumbar Strain (2020)"],
        pastMedicines: ["Diclofenac"],
        aiSummary: "Likely recurrence of lumbar strain. Physical examination required to rule out herniation."
    },

    // Low Priority
    {
        id: 5,
        name: "Jessica Wilson",
        age: 22,
        gender: "Female",
        disease: "Routine Checkup",
        message: "Annual physical examination.",
        appointmentTime: "02:00 PM",
        status: "waiting",
        priority: "low",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
        medicalHistory: ["None"],
        pastMedicines: ["None"],
        aiSummary: "Routine visit. No current complaints."
    },
    {
        id: 6,
        name: "David Lee",
        age: 30,
        gender: "Male",
        disease: "Skin Rash",
        message: "Mild itchiness on arm, possible allergy.",
        appointmentTime: "02:30 PM",
        status: "waiting",
        priority: "low",
        image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=800&q=80",
        medicalHistory: ["Pollen Allergy"],
        pastMedicines: ["Cetirizine"],
        aiSummary: "Localized allergic reaction. Non-urgent."
    }
];
