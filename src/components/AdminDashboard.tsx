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
import { mockDashboardData } from '../data/mockDashboardData';
import { toast } from 'sonner';
import { NotificationPanel } from './NotificationPanel';

/* =======================
   Types
======================= */

interface AdminDashboardProps {
  onBack: () => void;
}

export interface DiseaseTrendEntry {
  month: string;
  flu: number;
  hypertension: number;
  diabetes: number;
  covid: number;
}

export interface DiseaseDistributionEntry {
  name: string;
  value: number;
  color: string;
}

export interface MedicineStockEntry {
  id: number;
  name: string;
  stock: number;
  reorderLevel: number;
  price: number;
  expiry: string;
  status: 'optimal' | 'low' | 'critical';
}

export interface MedicineUsageEntry {
  category: string;
  usage: number;
  available: number;
}

export interface MonthlyRevenueEntry {
  month: string;
  revenue: number;
  expenses: number;
}

export interface DashboardMetrics {
  totalPatients: number;
  activeConsultations: number;
  revenueJan: number;
  lowStockAlerts: number;
  hospitals: number;
  doctors: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  diseaseTrendData: DiseaseTrendEntry[];
  diseaseDistribution: DiseaseDistributionEntry[];
  medicineStock: MedicineStockEntry[];
  monthlyRevenue: MonthlyRevenueEntry[];
  medicineUsageData: MedicineUsageEntry[];
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
      const data = await apiCall<DashboardData>('/admin/dashboard');
      setDashboard(data);
    } catch (error) {
      console.warn('Failed to fetch dashboard data, using mock data', error);
      setDashboard(mockDashboardData);
      toast.info('Viewing Demo Data (Backend unreachable)');
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
      case 'optimal':
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
            <Select
              value={selectedView}
              onValueChange={(value) =>
                setSelectedView(
                  value as
                  | 'overview'
                  | 'diseases'
                  | 'inventory'
                  | 'reports'
                  | 'doctors'
                )
              }
            >
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                +12%
              </Badge>
            </div>
            <p className="text-3xl mb-1">
              {dashboard?.metrics?.totalPatients ?? 0}
            </p>
            <p className="text-sm text-blue-100">Total Patients (Jan)</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-8 h-8 opacity-80" />
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                Live
              </Badge>
            </div>
            <p className="text-3xl mb-1">
              {dashboard?.metrics?.activeConsultations ?? 0}
            </p>
            <p className="text-sm text-green-100">Active Consultations</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 opacity-80" />
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                +8%
              </Badge>
            </div>
            <p className="text-3xl mb-1">
              ₹
              {((dashboard?.metrics?.revenueJan ?? 0) / 100000).toFixed(1)}L
            </p>
            <p className="text-sm text-orange-100">Revenue (Jan)</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 opacity-80" />
              <Badge className="bg-white/20 text-white hover:bg-white/30">
                Critical
              </Badge>
            </div>
            <p className="text-3xl mb-1">
              {dashboard?.metrics?.lowStockAlerts ?? 0}
            </p>
            <p className="text-sm text-purple-100">Low Stock Alerts</p>
          </Card>
        </div>

        {/* Trending Diseases Panel */}
        {(selectedView === 'overview' || selectedView === 'diseases') && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h3 className="text-gray-800">Trending Diseases</h3>
                <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Insights
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <NotificationPanel count={5} />
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Line Chart */}
            <div className="mb-8">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={diseaseTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="flu"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Seasonal Flu"
                  />
                  <Line
                    type="monotone"
                    dataKey="hypertension"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Hypertension"
                  />
                  <Line
                    type="monotone"
                    dataKey="diabetes"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Diabetes"
                  />
                  <Line
                    type="monotone"
                    dataKey="covid"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="COVID-19"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Disease Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-800 mb-4">Current Month Distribution</h4>
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
              </div>

              <div>
                <h4 className="text-gray-800 mb-4">AI-Generated Insights</h4>
                <div className="space-y-3">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-blue-900 mb-1">
                          Seasonal Flu Surge
                        </p>
                        <p className="text-xs text-blue-700">
                          14% increase in flu cases. Stock up on antivirals and
                          analgesics.
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-amber-50 border-amber-200">
                    <div className="flex items-start gap-2">
                      <Activity className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-amber-900 mb-1">
                          Chronic Disease Trend
                        </p>
                        <p className="text-xs text-amber-700">
                          Steady rise in diabetes and hypertension cases. Increase
                          preventive care programs.
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-green-900 mb-1">
                          COVID-19 Decline
                        </p>
                        <p className="text-xs text-green-700">
                          Continued decrease in COVID-19 cases. Maintain current
                          protocols.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Medicine Stock Panel */}
        {(selectedView === 'overview' || selectedView === 'inventory') && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                <h3 className="text-gray-800">Medicine Inventory</h3>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Stock Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm text-gray-700">
                      Medicine Name
                    </th>
                    <th className="text-right py-3 px-4 text-sm text-gray-700">
                      Current Stock
                    </th>
                    <th className="text-right py-3 px-4 text-sm text-gray-700">
                      Price (₹)
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">
                      Expiry Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medicineStock.map((med) => (
                    <tr key={med.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {med.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 text-right">
                        {med.stock.toLocaleString()}
                        {med.stock < med.reorderLevel && (
                          <AlertTriangle className="w-4 h-4 text-red-500 inline ml-2" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 text-right">
                        ₹{med.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {med.expiry}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStockStatusColor(med.status)}>
                          {med.status.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Medicine Usage Chart */}
            <div>
              <h4 className="text-gray-800 mb-4">
                Medicine Usage vs Availability
              </h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={medicineUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="usage" fill="#3b82f6" name="Usage %" />
                  <Bar dataKey="available" fill="#10b981" name="Available %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Financial & Resource Charts */}
        {(selectedView === 'overview' || selectedView === 'reports') && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                <h3 className="text-gray-800">Financial Overview</h3>
                <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Predictions
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>

            {/* Revenue Chart */}
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>

            {/* AI Predictions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <p className="text-sm text-green-800 mb-1">
                  Predicted Feb Revenue
                </p>
                <p className="text-2xl text-green-900 mb-1">₹6.8L</p>
                <p className="text-xs text-green-700">+9.7% from Jan</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <p className="text-sm text-blue-800 mb-1">
                  Medicine Demand (Feb)
                </p>
                <p className="text-2xl text-blue-900 mb-1">High</p>
                <p className="text-xs text-blue-700">Stock up antibiotics</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <p className="text-sm text-purple-800 mb-1">
                  Patient Growth Rate
                </p>
                <p className="text-2xl text-purple-900 mb-1">+15%</p>
                <p className="text-xs text-purple-700">Increase staff capacity</p>
              </Card>
            </div>
          </Card>
        )}

        {/* Reports & Files */}
        {selectedView === 'reports' && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="text-gray-800">Reports & Downloads</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Monthly Patient Report - January 2026',
                  date: 'Jan 13, 2026',
                  size: '2.4 MB',
                },
                {
                  name: 'Disease Statistics - Q4 2025',
                  date: 'Jan 10, 2026',
                  size: '1.8 MB',
                },
                {
                  name: 'Medicine Inventory Report',
                  date: 'Jan 12, 2026',
                  size: '945 KB',
                },
                {
                  name: 'Financial Summary - December 2025',
                  date: 'Jan 05, 2026',
                  size: '1.2 MB',
                },
                {
                  name: 'Doctor Performance Report',
                  date: 'Jan 08, 2026',
                  size: '3.1 MB',
                },
                {
                  name: 'AI Health Insights - January',
                  date: 'Jan 13, 2026',
                  size: '876 KB',
                  ai: true,
                },
              ].map((report, idx) => (
                <Card
                  key={idx}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <p className="text-sm text-gray-800">{report.name}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>{report.date}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                      {report.ai && (
                        <Badge className="mt-2 bg-purple-100 text-purple-800 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          AI Generated
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Doctor Management */}
        {selectedView === 'doctors' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-gray-800">Doctor Management</h3>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Add New Doctor
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: 'Dr. Michael Chen',
                  specialty: 'General Physician',
                  patients: 2500,
                  rating: 4.8,
                  status: 'Available',
                  image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
                },
                {
                  name: 'Dr. Priya Sharma',
                  specialty: 'Cardiologist',
                  patients: 1800,
                  rating: 4.9,
                  status: 'Available',
                  image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80',
                },
                {
                  name: 'Dr. Rajesh Kumar',
                  specialty: 'Pediatrician',
                  patients: 2100,
                  rating: 4.7,
                  status: 'On Leave',
                  image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
                },
                {
                  name: 'Dr. Sarah Johnson',
                  specialty: 'Dermatologist',
                  patients: 1500,
                  rating: 4.8,
                  status: 'Available',
                  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
                },
                {
                  name: 'Dr. Amit Patel',
                  specialty: 'Orthopedic',
                  patients: 1900,
                  rating: 4.6,
                  status: 'Busy',
                  image: 'https://images.unsplash.com/photo-1612916194234-f68f1c7263b0?auto=format&fit=crop&w=800&q=80',
                },
                {
                  name: 'Dr. Lisa Wong',
                  specialty: 'Neurologist',
                  patients: 1600,
                  rating: 4.9,
                  status: 'Available',
                  image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=800&q=80',
                },
              ].map((doctor, idx) => (
                <Card
                  key={idx}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={doctor.image}
                        alt={doctor.name}
                      />
                      <AvatarFallback>
                        {doctor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 mb-1">
                        {doctor.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {doctor.specialty}
                      </p>
                    </div>
                    <Badge
                      className={
                        doctor.status === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : doctor.status === 'Busy'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {doctor.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{doctor.patients}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{doctor.rating}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
