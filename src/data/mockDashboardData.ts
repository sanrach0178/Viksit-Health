import { DashboardData } from '../components/AdminDashboard';

export const mockDashboardData: DashboardData = {
    metrics: {
        totalPatients: 1248,
        activeConsultations: 42,
        revenueJan: 680000,
        lowStockAlerts: 3,
        hospitals: 5,
        doctors: 14
    },
    diseaseTrendData: [
        { month: 'Aug', flu: 120, hypertension: 110, diabetes: 100, covid: 40 },
        { month: 'Sep', flu: 140, hypertension: 115, diabetes: 102, covid: 35 },
        { month: 'Oct', flu: 180, hypertension: 112, diabetes: 105, covid: 30 },
        { month: 'Nov', flu: 250, hypertension: 118, diabetes: 103, covid: 45 },
        { month: 'Dec', flu: 320, hypertension: 121, diabetes: 104, covid: 60 },
        { month: 'Jan', flu: 280, hypertension: 112, diabetes: 103, covid: 32 }
    ],
    diseaseDistribution: [
        { name: 'Seasonal Flu', value: 280, color: '#3b82f6' },
        { name: 'Hypertension', value: 112, color: '#ef4444' },
        { name: 'Diabetes', value: 103, color: '#f59e0b' },
        { name: 'COVID-19', value: 32, color: '#8b5cf6' },
        { name: 'Others', value: 132, color: '#10b981' }
    ],
    medicineStock: [
        { id: 1, name: 'Paracetamol 500mg', stock: 5000, reorderLevel: 1000, price: 1.5, expiry: '2027-06', status: 'optimal' },
        { id: 2, name: 'Amoxicillin 250mg', stock: 240, reorderLevel: 500, price: 5.0, expiry: '2026-12', status: 'low' },
        { id: 3, name: 'Vitamin C 500mg', stock: 1200, reorderLevel: 300, price: 3.0, expiry: '2027-03', status: 'optimal' },
        { id: 4, name: 'Ibuprofen 400mg', stock: 80, reorderLevel: 200, price: 2.0, expiry: '2026-10', status: 'critical' },
        { id: 5, name: 'Azithromycin 500mg', stock: 680, reorderLevel: 150, price: 12.0, expiry: '2026-08', status: 'optimal' },
        { id: 6, name: 'Metformin 500mg', stock: 3000, reorderLevel: 800, price: 4.0, expiry: '2027-11', status: 'optimal' }
    ],
    monthlyRevenue: [
        { month: 'Aug', revenue: 450000, expenses: 320000 },
        { month: 'Sep', revenue: 480000, expenses: 340000 },
        { month: 'Oct', revenue: 520000, expenses: 350000 },
        { month: 'Nov', revenue: 580000, expenses: 380000 },
        { month: 'Dec', revenue: 650000, expenses: 400000 },
        { month: 'Jan', revenue: 620000, expenses: 410000 }
    ],
    medicineUsageData: [
        { category: 'Antibiotics', usage: 85, available: 45 },
        { category: 'Painkillers', usage: 78, available: 92 },
        { category: 'Antivirals', usage: 65, available: 88 },
        { category: 'Vitamins', usage: 45, available: 95 },
        { category: 'Cardio', usage: 62, available: 75 }
    ]
};
