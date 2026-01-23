import { useState } from 'react';
import { Bell, Building2, TrendingUp, Package, FileText, Users, AlertTriangle, Download, Activity, DollarSign, Sparkles, ChevronDown, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [selectedView, setSelectedView] = useState('overview');

  const adminData = {
    name: 'Admin',
    hospital: 'Viksit Health Hospital',
    image: 'https://images.pexels.com/photos/28216688/pexels-photo-28216688.png',
  };

  // Trending Diseases Data
  const diseaseTrendData = [
    { month: 'Aug', flu: 120, diabetes: 85, hypertension: 95, covid: 45 },
    { month: 'Sep', flu: 135, diabetes: 88, hypertension: 98, covid: 38 },
    { month: 'Oct', flu: 165, diabetes: 92, hypertension: 102, covid: 42 },
    { month: 'Nov', flu: 198, diabetes: 96, hypertension: 105, covid: 35 },
    { month: 'Dec', flu: 245, diabetes: 99, hypertension: 108, covid: 28 },
    { month: 'Jan', flu: 280, diabetes: 103, hypertension: 112, covid: 32 },
  ];

  const diseaseDistribution = [
    { name: 'Seasonal Flu', value: 280, color: '#3b82f6' },
    { name: 'Hypertension', value: 112, color: '#ef4444' },
    { name: 'Diabetes', value: 103, color: '#f59e0b' },
    { name: 'COVID-19', value: 32, color: '#8b5cf6' },
    { name: 'Others', value: 95, color: '#10b981' },
  ];

  // Medicine Stock Data
  const medicineStock = [
    { 
      id: 1, 
      name: 'Paracetamol 500mg', 
      stock: 2450, 
      price: 2.5, 
      expiry: 'Dec 2026', 
      status: 'good',
      reorderLevel: 500,
    },
    { 
      id: 2, 
      name: 'Amoxicillin 250mg', 
      stock: 1820, 
      price: 12.0, 
      expiry: 'Mar 2026', 
      status: 'good',
      reorderLevel: 500,
    },
    { 
      id: 3, 
      name: 'Metformin 500mg', 
      stock: 380, 
      price: 8.5, 
      expiry: 'Jun 2026', 
      status: 'low',
      reorderLevel: 500,
    },
    { 
      id: 4, 
      name: 'Amlodipine 5mg', 
      stock: 1520, 
      price: 15.0, 
      expiry: 'Sep 2026', 
      status: 'good',
      reorderLevel: 500,
    },
    { 
      id: 5, 
      name: 'Azithromycin 250mg', 
      stock: 890, 
      price: 18.5, 
      expiry: 'Aug 2026', 
      status: 'good',
      reorderLevel: 500,
    },
    { 
      id: 6, 
      name: 'Insulin Glargine', 
      stock: 145, 
      price: 125.0, 
      expiry: 'Feb 2026', 
      status: 'critical',
      reorderLevel: 200,
    },
  ];

  // Financial Data
  const monthlyRevenue = [
    { month: 'Aug', revenue: 450000, expenses: 320000 },
    { month: 'Sep', revenue: 480000, expenses: 325000 },
    { month: 'Oct', revenue: 510000, expenses: 340000 },
    { month: 'Nov', revenue: 525000, expenses: 345000 },
    { month: 'Dec', revenue: 580000, expenses: 360000 },
    { month: 'Jan', revenue: 620000, expenses: 375000 },
  ];

  const medicineUsageData = [
    { category: 'Antibiotics', usage: 35, available: 65 },
    { category: 'Analgesics', usage: 55, available: 45 },
    { category: 'Diabetes', usage: 42, available: 58 },
    { category: 'Cardiac', usage: 38, available: 62 },
    { category: 'Respiratory', usage: 48, available: 52 },
  ];

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'good': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-900">{adminData.hospital}</p>
                  <p className="text-xs text-gray-500">Administrator Dashboard</p>
                </div>
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
                </SelectContent>
              </Select>
              <Avatar className="w-10 h-10">
                <AvatarImage src={adminData.image} alt={adminData.name} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar + Main Content Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen p-4 hidden lg:block">
          <nav className="space-y-2">
            {[
              { id: 'overview', icon: Activity, label: 'Overview' },
              { id: 'diseases', icon: TrendingUp, label: 'Disease Trends' },
              { id: 'inventory', icon: Package, label: 'Medicine Stock' },
              { id: 'doctors', icon: Users, label: 'Doctor Management' },
              { id: 'reports', icon: FileText, label: 'Reports' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  selectedView === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 opacity-80" />
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  +12%
                </Badge>
              </div>
              <p className="text-3xl mb-1">1,248</p>
              <p className="text-sm text-blue-100">Total Patients (Jan)</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-8 h-8 opacity-80" />
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  Live
                </Badge>
              </div>
              <p className="text-3xl mb-1">45</p>
              <p className="text-sm text-green-100">Active Consultations</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 opacity-80" />
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  +8%
                </Badge>
              </div>
              <p className="text-3xl mb-1">₹6.2L</p>
              <p className="text-sm text-orange-100">Revenue (Jan)</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between mb-2">
                <Package className="w-8 h-8 opacity-80" />
                <Badge className="bg-white/20 text-white hover:bg-white/30">
                  Critical
                </Badge>
              </div>
              <p className="text-3xl mb-1">3</p>
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
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
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
                    <Line type="monotone" dataKey="flu" stroke="#3b82f6" strokeWidth={2} name="Seasonal Flu" />
                    <Line type="monotone" dataKey="hypertension" stroke="#ef4444" strokeWidth={2} name="Hypertension" />
                    <Line type="monotone" dataKey="diabetes" stroke="#f59e0b" strokeWidth={2} name="Diabetes" />
                    <Line type="monotone" dataKey="covid" stroke="#8b5cf6" strokeWidth={2} name="COVID-19" />
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
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diseaseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                          <p className="text-sm text-blue-900 mb-1">Seasonal Flu Surge</p>
                          <p className="text-xs text-blue-700">
                            14% increase in flu cases. Stock up on antivirals and analgesics.
                          </p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-amber-50 border-amber-200">
                      <div className="flex items-start gap-2">
                        <Activity className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-amber-900 mb-1">Chronic Disease Trend</p>
                          <p className="text-xs text-amber-700">
                            Steady rise in diabetes and hypertension cases. Increase preventive care programs.
                          </p>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4 bg-green-50 border-green-200">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-green-900 mb-1">COVID-19 Decline</p>
                          <p className="text-xs text-green-700">
                            Continued decrease in COVID-19 cases. Maintain current protocols.
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
                      <th className="text-left py-3 px-4 text-sm text-gray-700">Medicine Name</th>
                      <th className="text-right py-3 px-4 text-sm text-gray-700">Current Stock</th>
                      <th className="text-right py-3 px-4 text-sm text-gray-700">Price (₹)</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-700">Expiry Date</th>
                      <th className="text-left py-3 px-4 text-sm text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineStock.map((med) => (
                      <tr key={med.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-800">{med.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-800 text-right">
                          {med.stock.toLocaleString()}
                          {med.stock < med.reorderLevel && (
                            <AlertTriangle className="w-4 h-4 text-red-500 inline ml-2" />
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 text-right">
                          ₹{med.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{med.expiry}</td>
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
                <h4 className="text-gray-800 mb-4">Medicine Usage vs Availability</h4>
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
                  <p className="text-sm text-green-800 mb-1">Predicted Feb Revenue</p>
                  <p className="text-2xl text-green-900 mb-1">₹6.8L</p>
                  <p className="text-xs text-green-700">+9.7% from Jan</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                  <p className="text-sm text-blue-800 mb-1">Medicine Demand (Feb)</p>
                  <p className="text-2xl text-blue-900 mb-1">High</p>
                  <p className="text-xs text-blue-700">Stock up antibiotics</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                  <p className="text-sm text-purple-800 mb-1">Patient Growth Rate</p>
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
                  { name: 'Monthly Patient Report - January 2026', date: 'Jan 13, 2026', size: '2.4 MB' },
                  { name: 'Disease Statistics - Q4 2025', date: 'Jan 10, 2026', size: '1.8 MB' },
                  { name: 'Medicine Inventory Report', date: 'Jan 12, 2026', size: '945 KB' },
                  { name: 'Financial Summary - December 2025', date: 'Jan 05, 2026', size: '1.2 MB' },
                  { name: 'Doctor Performance Report', date: 'Jan 08, 2026', size: '3.1 MB' },
                  { name: 'AI Health Insights - January', date: 'Jan 13, 2026', size: '876 KB', ai: true },
                ].map((report, idx) => (
                  <Card key={idx} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
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
                  { name: 'Dr. Michael Chen', specialty: 'General Physician', patients: 2500, rating: 4.8, status: 'Available' },
                  { name: 'Dr. Priya Sharma', specialty: 'Cardiologist', patients: 1800, rating: 4.9, status: 'Available' },
                  { name: 'Dr. Rajesh Kumar', specialty: 'Pediatrician', patients: 2100, rating: 4.7, status: 'On Leave' },
                  { name: 'Dr. Sarah Johnson', specialty: 'Dermatologist', patients: 1500, rating: 4.8, status: 'Available' },
                  { name: 'Dr. Amit Patel', specialty: 'Orthopedic', patients: 1900, rating: 4.6, status: 'Busy' },
                  { name: 'Dr. Lisa Wong', specialty: 'Neurologist', patients: 1600, rating: 4.9, status: 'Available' },
                ].map((doctor, idx) => (
                  <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage 
                          src="https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2ODMwODM4MHww&ixlib=rb-4.1.0&q=80&w=1080" 
                          alt={doctor.name} 
                        />
                        <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 mb-1">{doctor.name}</p>
                        <p className="text-xs text-gray-600">{doctor.specialty}</p>
                      </div>
                      <Badge className={
                        doctor.status === 'Available' ? 'bg-green-100 text-green-800' :
                        doctor.status === 'Busy' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
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
    </div>
  );
}