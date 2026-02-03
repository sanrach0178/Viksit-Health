import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Mic,
  Search,
  Bed,
  User,
  CheckCircle,
  Calendar,
  Building2,
  Stethoscope
} from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { apiCall, ApiError } from '../services/apiClient';
import { logger } from '../services/logger';
import { sanitizeInput } from '../utils/validation';
import { NotificationPanel, Notification } from './NotificationPanel';

interface PatientDashboardProps {
  onBack: () => void;
}

interface Hospital {
  id: number;
  name: string;
  distance: string;
  fees: number;
  beds: {
    free: number;
    occupied: number;
    cleaning: number;
  };
  waitingTime: string;
  rating: number;
  image: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  availableSlots: string[];
  image: string;
  hospitalId: number;
}

export function PatientDashboard({ onBack }: PatientDashboardProps) {
  const [symptoms, setSymptoms] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const patientNotifications: Notification[] = [
    {
      id: 1,
      title: 'Upcoming Appointment',
      message: 'Reminder: You have an appointment with Dr. Michael Chen tomorrow at 10:00 AM.',
      time: '1 hour ago',
      type: 'info',
      read: false,
    },
    {
      id: 2,
      title: 'Health Check Reminder',
      message: 'It has been 6 months since your last dental checkup.',
      time: '2 days ago',
      type: 'info',
      read: true,
    }
  ];

  const patientData = {
    name: 'Sarah Johnson',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmF0YXIlMjBzaWxob3VldHRlfGVufDF8fHx8MTc2ODMwODM4MHww&ixlib=rb-4.1.0&q=80&w=1080',
  };

  const aiPrediction = {
    department: 'General Medicine',
    waitingTime: '15-20 minutes',
    confidence: 92,
  };

  const hospitalDoctors = useMemo(() => {
    if (!selectedHospital) return [];
    return doctors.filter(d => d.hospitalId === selectedHospital.id);
  }, [doctors, selectedHospital]);

  const fetchHospitals = async (): Promise<void> => {
    setLoadingHospitals(true);
    try {
      const data = await apiCall<Hospital[]>("/api/hospitals");
      setHospitals(data);
    } catch (error) {
      if (error instanceof ApiError) {
        logger.error(`Failed to load hospitals: ${error.message}`);
      }
      setHospitals([]);
    } finally {
      setLoadingHospitals(false);
    }
  };

  const fetchDoctors = async (): Promise<void> => {
    setLoadingDoctors(true);
    try {
      const data = await apiCall<Doctor[]>("/api/doctors");
      setDoctors(data);
    } catch (error) {
      if (error instanceof ApiError) {
        logger.error(`Failed to load doctors: ${error.message}`);
      }
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    if (!showResults) return;
    void fetchHospitals();
    void fetchDoctors();
  }, [showResults]);

  const handleFindHospital = (): void => {
    const sanitized = sanitizeInput(symptoms);
    if (sanitized.trim()) {
      setShowResults(true);
      setSelectedHospital(null);
      setSelectedDoctor(null);
      setBookingConfirmed(false);
      setBookingError(null);
    }
  };

  const handleViewDoctors = (hospital: Hospital): void => {
    setSelectedHospital(hospital);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setBookingConfirmed(false);
    setBookingError(null);
  };

  const handleBookAppointment = async (doctor: Doctor, slot: string): Promise<void> => {
    if (!selectedHospital) return;
    setBookingError(null);
    setSelectedDoctor(doctor);
    setSelectedSlot(slot);

    try {
      await apiCall("/api/appointments", {
        method: "POST",
        body: JSON.stringify({
          patientName: sanitizeInput(patientData.name),
          symptoms: sanitizeInput(symptoms),
          hospitalId: selectedHospital.id,
          doctorId: doctor.id,
          slot,
        }),
      });
      setBookingConfirmed(true);
      logger.info('Appointment booked successfully', { doctorId: doctor.id });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Booking failed. Please try again.';
      setBookingError(message);
      logger.error('Booking failed', error);
    }
  };

  const handleBackToSymptoms = (): void => {
    setShowResults(false);
    setSelectedHospital(null);
    setSelectedDoctor(null);
    setBookingConfirmed(false);
    setSymptoms('');
    setBookingError(null);
  };

  // Show Booking Confirmation
  if (bookingConfirmed && selectedHospital && selectedDoctor && selectedSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Top Bar */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={onBack}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ← Back
                </button>
                <h1 className="text-blue-600">Viksit Health</h1>
              </div>
              <div className="flex items-center gap-3">
                <NotificationPanel count={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">Your appointment has been successfully scheduled</p>
          </div>

          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hospital</p>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <p className="text-gray-800">{selectedHospital.name}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Doctor</p>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-800">{selectedDoctor.name}</p>
                    <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Appointment Time</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <p className="text-gray-800">{selectedSlot} • Today, Jan 13, 2026</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Confirmed & Booked
                </Badge>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
                <p className="text-2xl text-gray-800">₹{selectedHospital.fees}</p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleBackToSymptoms}
            >
              Book Another Appointment
            </Button>
            <Button
              variant="outline"
              onClick={onBack}
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show Doctor Selection
  if (selectedHospital && !bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Top Bar */}
        <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedHospital(null)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  ← Back
                </button>
                <h1 className="text-blue-600">Viksit Health</h1>
              </div>
              <div className="flex items-center gap-3">
                <NotificationPanel count={2} />
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Selection Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h2 className="text-gray-800 mb-2">Select Doctor</h2>
            <p className="text-gray-600">{selectedHospital.name}</p>
          </div>

          {loadingDoctors && (
            <Card className="p-4 bg-white mb-6">
              <p className="text-sm text-gray-600">Loading doctors…</p>
            </Card>
          )}

          {bookingError && (
            <Card className="p-4 bg-red-50 border-red-200 mb-6">
              <p className="text-sm text-red-800">{bookingError}</p>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitalDoctors.map((doctor) => (
              <Card key={doctor.id} className="p-5 hover:shadow-lg transition-shadow bg-white">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedHospital.image} alt={selectedHospital.name} />
                    <AvatarFallback>{selectedHospital.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-gray-800 mb-1">{doctor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{doctor.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{doctor.experience} years</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">Available Slots</p>
                  <div className="grid grid-cols-2 gap-2">
                    {doctor.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleBookAppointment(doctor, slot)}
                        className="px-3 py-2 text-sm border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors text-gray-700"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Top Bar */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-blue-600">Viksit Health</h1>
            </div>
            <div className="flex items-center gap-3">
              <NotificationPanel notifications={patientNotifications} count={1} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Symptom Input Card */}
        <Card className="p-6 bg-white">
          <h2 className="text-gray-800 mb-4">How are you feeling today?</h2>

          <div className="mb-4">
            <Textarea
              placeholder="Enter your symptoms (e.g., fever, headache, cough...)"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[100px] mb-3"
            />
            <div className="flex items-center gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleFindHospital}
                disabled={!symptoms.trim()}
              >
                <Search className="w-4 h-4 mr-2" />
                Find Best Hospital
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-blue-300 hover:bg-blue-50"
              >
                <Mic className="w-5 h-5 text-blue-600" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            AI-powered suggestions based on your symptoms
          </p>
        </Card>

        {/* AI Result Section */}
        {showResults && (
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
            <div className="flex items-start gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-gray-800">AI Prediction</h3>
                  <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                    AI-Predicted
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Suggested Department</p>
                    <p className="text-gray-800">{aiPrediction.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated Waiting Time</p>
                    <p className="text-gray-800">{aiPrediction.waitingTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Confidence</p>
                    <p className="text-gray-800">{aiPrediction.confidence}%</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Nearby Hospitals List */}
        {showResults && (
          <div>
            <h2 className="text-gray-800 mb-4">Nearby Hospitals</h2>

            {loadingHospitals && (
              <Card className="p-4 bg-white mb-4">
                <p className="text-sm text-gray-600">Loading hospitals…</p>
              </Card>
            )}

            <div className="space-y-4">
              {hospitals.map((hospital) => (
                <Card key={hospital.id} className="p-6 hover:shadow-lg transition-shadow bg-white">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Hospital Image Frame */}
                    <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-full lg:w-48 h-40 rounded-lg object-cover border-2 border-gray-200 flex-shrink-0"
                    />

                    {/* Hospital Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-gray-800">{hospital.name}</h3>
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm">{hospital.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {hospital.distance}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {hospital.waitingTime} wait
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-green-700">₹{hospital.fees}</span>
                          </div>
                        </div>
                      </div>

                      {/* Beds Status */}
                      <div>
                        <p className="text-sm text-gray-700 mb-2">Bed Availability</p>
                        <div className="flex flex-wrap gap-3">
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <Bed className="w-3 h-3 mr-1" />
                            {hospital.beds.free} Free
                          </Badge>
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            <Bed className="w-3 h-3 mr-1" />
                            {hospital.beds.occupied} Occupied
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            <Bed className="w-3 h-3 mr-1" />
                            {hospital.beds.cleaning} Cleaning
                          </Badge>
                        </div>
                      </div>

                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full lg:w-auto"
                        onClick={() => handleViewDoctors(hospital)}
                      >
                        <Stethoscope className="w-4 h-4 mr-2" />
                        View Doctors
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Doctor Selection - Shown when hospital selected */}
        {selectedHospital && !bookingConfirmed && (
          <div>
            <h2 className="text-gray-800 mb-4">Select Doctor - {selectedHospital.name}</h2>

            {loadingDoctors && (
              <Card className="p-4 bg-white mb-4">
                <p className="text-sm text-gray-600">Loading doctors…</p>
              </Card>
            )}

            {bookingError && (
              <Card className="p-4 bg-red-50 border-red-200 mb-6">
                <p className="text-sm text-red-800">{bookingError}</p>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitalDoctors.map((doctor) => (
                <Card key={doctor.id} className="p-5 hover:shadow-lg transition-shadow bg-white">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={selectedHospital.image} alt={selectedHospital.name} />
                      <AvatarFallback>{selectedHospital.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-gray-800 mb-1">{doctor.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{doctor.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{doctor.experience} years</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-700 mb-2">Available Slots</p>
                    <div className="grid grid-cols-2 gap-2">
                      {doctor.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => handleBookAppointment(doctor, slot)}
                          className="px-3 py-2 text-sm border border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-colors text-gray-700"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Booking Confirmation */}
        {bookingConfirmed && selectedHospital && selectedDoctor && selectedSlot && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your appointment has been successfully scheduled</p>

            <Card className="p-6 mb-6 max-w-2xl mx-auto">
              <div className="space-y-4 text-left">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hospital</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <p className="text-gray-800">{selectedHospital.name}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Doctor</p>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-800">{selectedDoctor.name}</p>
                      <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Appointment Time</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <p className="text-gray-800">{selectedSlot}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
                  <p className="text-2xl text-gray-800">₹{selectedHospital.fees}</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleBackToSymptoms}
              >
                Book Another Appointment
              </Button>
              <Button
                variant="outline"
                onClick={onBack}
              >
                Go to Home
              </Button>
            </div>
          </div>
        )}

        {/* Helpful Tips - Show when no results */}
        {!showResults && (
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="text-gray-800 mb-3">💡 Helpful Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Be specific about your symptoms for better AI predictions</li>
              <li>• Include duration and severity (e.g., "severe headache for 2 days")</li>
              <li>• You can use voice input for faster entry</li>
              <li>• Our AI will suggest the best department and hospital for you</li>
            </ul>
          </Card>
        )}
      </div>
    </div >
  );
}