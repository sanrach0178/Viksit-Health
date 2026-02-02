import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  TrendingUp,
  Package,
  FileText,
  Users,
  AlertTriangle,
  Download,
  Activity,
  DollarSign,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

import { apiCall } from '../services/apiClient';

/* =======================
   Types
======================= */

interface AdminDashboardProps {
  onBack: () => void;
}

interface DiseaseTrendEntry {
  month: string;
  flu: number;
  hypertension: number;
  diabetes: number;
  covid: number;
}

interface DiseaseDistributionEntry {
  name: string;
  value: number;
  color: string;
}

interface MedicineStockEntry {
  id: string;
  name: string;
  stock: number;
  reorderLevel: number;
  price: number;
  expiry: string;
  status: 'critical' | 'low' | 'good';
}

interface MedicineUsageEntry {
  category: string;
  usage: number;
  available: number;
}

interface MonthlyRevenueEntry {
  month: string;
  revenue: number;
  expenses: number;
}

interface DashboardMetrics {
  totalPatients: number;
  activeConsultations: number;
  revenueJan: number;
  lowStockAlerts: number;
}

interface DashboardData {
  diseaseTrendData: DiseaseTrendEntry[];
  diseaseDistribution: DiseaseDistributionEntry[];
  medicineStock: MedicineStockEntry[];
  medicineUsageData: MedicineUsageEntry[];
  monthlyRevenue: MonthlyRevenueEntry[];
  metrics: DashboardMetrics;
}

/* =======================
   Component
======================= */

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [selectedView, setSelectedView] = useState<
    'overview' | 'diseases' | 'inventory' | 'reports' | 'doctors'
  >('overview');

  const [loading, setLoading] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const adminData = {
    name: 'Admin',
    hospital: 'Viksit Health Hospital',
    image:
      'https://i.pinimg.com/736x/3c/ae/07/3cae079ca0b9e55ec6bfc1b358c9b1e2.jpg',
  };

  const fetchDashboard = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await apiCall<DashboardData>('/api/admin/dashboard');
      setDashboard(data);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDashboard();
  }, []);

  /* =======================
     Derived Data
  ======================= */

  const diseaseTrendData = useMemo<DiseaseTrendEntry[]>(
    () => dashboard?.diseaseTrendData ?? [],
    [dashboard]
  );

  const diseaseDistribution = useMemo<DiseaseDistributionEntry[]>(
    () => dashboard?.diseaseDistribution ?? [],
    [dashboard]
  );

  const medicineStock = useMemo<MedicineStockEntry[]>(
    () => dashboard?.medicineStock ?? [],
    [dashboard]
  );

  const monthlyRevenue = useMemo<MonthlyRevenueEntry[]>(
    () => dashboard?.monthlyRevenue ?? [],
    [dashboard]
  );

  const medicineUsageData = useMemo<MedicineUsageEntry[]>(
    () => dashboard?.medicineUsageData ?? [],
    [dashboard]
  );

  const getStockStatusColor = (status: MedicineStockEntry['status']): string => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'good':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  /* =======================
     JSX
  ======================= */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back
            </button>
            <Building2 className="w-6 h-6 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-900">{adminData.hospital}</p>
              <p className="text-xs text-gray-500">Administrator Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="diseases">Disease Trends</SelectItem>
                <SelectItem value="inventory">Medicine Stock</SelectItem>
                <SelectItem value="reports">Reports</SelectItem>
                <SelectItem value="doctors">Doctors</SelectItem>
              </SelectContent>
            </Select>

            <Avatar className="w-10 h-10">
              <AvatarImage src={adminData.image} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>

            <Bell className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {loading && <Card className="p-4">Loading dashboard…</Card>}

        {/* Pie Chart */}
        <Card className="p-6">
          <h4 className="mb-4">Current Month Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={diseaseDistribution}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={(entry: DiseaseDistributionEntry) =>
                  `${entry.name}: ${entry.value}`
                }
              >
                {diseaseDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
