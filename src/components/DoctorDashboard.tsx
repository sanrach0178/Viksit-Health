import { useEffect, useState } from 'react';
import { Bell, Calendar, Star, User, Activity, FileText, Pill, Clock, AlertCircle, CheckCircle, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { apiCall } from '../services/apiClient';
import { mockPatients } from '../data/mockDoctorData';
import { toast } from 'sonner';

interface DoctorDashboardProps {
  onBack: () => void;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  disease: string;
  message: string;
  appointmentTime: string;
  status: 'waiting' | 'in-progress' | 'completed';
  image: string;
  medicalHistory?: string[];
  pastMedicines?: string[];
  aiSummary?: string;
  priority?: 'high' | 'medium' | 'low';
}

export function DoctorDashboard({ onBack }: DoctorDashboardProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const doctorData = {
    name: 'Dr. Michael Chen',
    specialty: 'General Physician',
    experience: 15,
    rating: 4.8,
    totalPatients: 2500,
    image: 'https://images.unsplash.com/photo-1758691463626-0ab959babe00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2ODMwODM4MHww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'Available',
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await apiCall<Patient[]>('/api/doctor/patients');
      setPatients(data);
    } catch (error) {
      console.warn("Failed to load patients, using mock data", error);
      setPatients(mockPatients);
      toast.info('Viewing Demo Data (Backend unreachable)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPatients();
  }, []);

  const handleSaveConsultation = () => {
    void (async () => {
      if (!selectedPatient) return;
      setSaveError(null);
      setSaveError(null);
      try {
        await apiCall('/api/doctor/consultations', {
          method: "POST",
          body: JSON.stringify({
            appointmentId: selectedPatient.id,
            diagnosis,
            prescription,
            notes,
          }),
        });

        await fetchPatients();
        setSelectedPatient(null);
        setDiagnosis('');
        setPrescription('');
        setNotes('');
      } catch (error) {
        setSaveError("Failed to save consultation. Please try again.");
      }
    })();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                ← Back
              </button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={doctorData.image} alt={doctorData.name} />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-900">{doctorData.name}</p>
                <p className="text-xs text-gray-500">{doctorData.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                {doctorData.status}
              </Badge>
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  4
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Doctor Profile Card */}
        <Card className="bg-gradient-to-br from-green-500 to-emerald-400 text-white p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 border-4 border-white">
              <AvatarImage src={doctorData.image} alt={doctorData.name} />
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-white mb-1">{doctorData.name}</h2>
              <p className="text-green-50 text-sm mb-3">{doctorData.specialty}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-white" />
                  <span>{doctorData.rating} Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{doctorData.totalPatients}+ Patients</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  <span>{doctorData.experience} Years Exp</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white">
            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-2xl mb-1">12</p>
            <p className="text-sm text-gray-600">Today's Appointments</p>
          </Card>
          <Card className="p-4 bg-white">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-2xl mb-1">8</p>
            <p className="text-sm text-gray-600">Completed</p>
          </Card>
          <Card className="p-4 bg-white">
            <Clock className="w-6 h-6 text-yellow-600 mb-2" />
            <p className="text-2xl mb-1">4</p>
            <p className="text-sm text-gray-600">Waiting</p>
          </Card>
          <Card className="p-4 bg-white">
            <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
            <p className="text-2xl mb-1">0</p>
            <p className="text-sm text-gray-600">Urgent</p>
          </Card>
        </div>

        {/* Patient Queue by Priority */}
        <div>
          <h3 className="text-gray-800 mb-4">Patient Queue</h3>
          {loading && (
            <Card className="p-4 bg-white mb-4">
              <p className="text-sm text-gray-600">Loading patients…</p>
            </Card>
          )}

          {/* High Priority */}
          <div className="mb-8">
            <h4 className="text-red-600 font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              High Priority
            </h4>
            <div className="space-y-4">
              {patients.filter(p => p.priority === 'high').map((patient) => (
                <Card
                  key={patient.id}
                  className="p-5 hover:shadow-lg transition-shadow cursor-pointer bg-white border-l-4 border-l-red-500"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={patient.image} alt={patient.name} />
                      <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-gray-800 mb-1 font-semibold">{patient.name}</h4>
                          <p className="text-sm text-gray-600">
                            {patient.age} years • {patient.gender}
                          </p>
                        </div>
                        <Badge className="bg-red-100 text-red-800">
                          High Priority
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-800 mb-1">
                          <span className="text-red-600 font-medium">Complaint:</span> {patient.disease}
                        </p>
                        <p className="text-sm text-gray-600 italic">"{patient.message}"</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {patient.appointmentTime}
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          Attend Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {patients.filter(p => p.priority === 'high').length === 0 && (
                <p className="text-sm text-gray-500 italic px-4">No high priority patients.</p>
              )}
            </div>
          </div>

          {/* Medium Priority */}
          <div className="mb-8">
            <h4 className="text-yellow-600 font-medium mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Medium Priority
            </h4>
            <div className="space-y-4">
              {patients.filter(p => p.priority === 'medium').map((patient) => (
                <Card
                  key={patient.id}
                  className="p-5 hover:shadow-lg transition-shadow cursor-pointer bg-white border-l-4 border-l-yellow-500"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={patient.image} alt={patient.name} />
                      <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-gray-800 mb-1 font-semibold">{patient.name}</h4>
                          <p className="text-sm text-gray-600">
                            {patient.age} years • {patient.gender}
                          </p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Medium Priority
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-800 mb-1">
                          <span className="text-yellow-600 font-medium">Complaint:</span> {patient.disease}
                        </p>
                        <p className="text-sm text-gray-600 italic">"{patient.message}"</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {patient.appointmentTime}
                        </div>
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {patients.filter(p => p.priority === 'medium').length === 0 && (
                <p className="text-sm text-gray-500 italic px-4">No medium priority patients.</p>
              )}
            </div>
          </div>

          {/* Low Priority */}
          <div className="mb-8">
            <h4 className="text-green-600 font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Low Priority
            </h4>
            <div className="space-y-4">
              {patients.filter(p => !p.priority || p.priority === 'low').map((patient) => (
                <Card
                  key={patient.id}
                  className="p-5 hover:shadow-lg transition-shadow cursor-pointer bg-white border-l-4 border-l-green-500"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={patient.image} alt={patient.name} />
                      <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-gray-800 mb-1 font-semibold">{patient.name}</h4>
                          <p className="text-sm text-gray-600">
                            {patient.age} years • {patient.gender}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Low Priority
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-gray-800 mb-1">
                          <span className="text-green-600 font-medium">Complaint:</span> {patient.disease}
                        </p>
                        <p className="text-sm text-gray-600 italic">"{patient.message}"</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {patient.appointmentTime}
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {patients.filter(p => !p.priority || p.priority === 'low').length === 0 && (
                <p className="text-sm text-gray-500 italic px-4">No low priority patients.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 pb-6">
          <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700">Patient Records</p>
          </Card>
          <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-700">Health Reports</p>
          </Card>
        </div>
      </div>

      {/* Patient Detail Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              Review and update patient details, diagnosis, and prescription.
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-6">
              {saveError && (
                <Card className="p-4 bg-red-50 border-red-200">
                  <p className="text-sm text-red-800">{saveError}</p>
                </Card>
              )}
              {/* Patient Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedPatient.image} alt={selectedPatient.name} />
                  <AvatarFallback>{selectedPatient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-gray-800">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedPatient.age} years • {selectedPatient.gender}
                  </p>
                  <Badge className="mt-1 bg-red-100 text-red-800">
                    {selectedPatient.disease}
                  </Badge>
                </div>
              </div>

              {/* Patient Message */}
              <Card className="p-4 bg-yellow-50 border-yellow-200">
                <p className="text-sm text-gray-700">
                  <span className="text-gray-900">Chief Complaint:</span> {selectedPatient.message}
                </p>
              </Card>

              {/* AI Summary */}
              {selectedPatient.aiSummary && (
                <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-purple-800 mb-1">AI-Generated Summary</p>
                      <p className="text-sm text-gray-700">{selectedPatient.aiSummary}</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Medical History */}
              <div>
                <h4 className="text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Medical History
                </h4>
                <Card className="p-4 bg-gray-50">
                  <ul className="space-y-1 text-sm text-gray-700">
                    {selectedPatient.medicalHistory?.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Past Medicines */}
              <div>
                <h4 className="text-gray-800 mb-2 flex items-center gap-2">
                  <Pill className="w-4 h-4" />
                  Past Medicines
                </h4>
                <Card className="p-4 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.pastMedicines?.map((med, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white">
                        {med}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Diagnosis Input */}
              <div>
                <label className="text-gray-800 mb-2 block">Add Diagnosis</label>
                <Textarea
                  placeholder="Enter diagnosis..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Prescription Input */}
              <div>
                <label className="text-gray-800 mb-2 block">Prescribe Medicine</label>
                <Textarea
                  placeholder="Enter prescription details..."
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-gray-800 mb-2 block">Consultation Notes</label>
                <Textarea
                  placeholder="Additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSaveConsultation}
                >
                  Save Consultation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPatient(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}