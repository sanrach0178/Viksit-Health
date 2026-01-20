import { Heart, Stethoscope, Building2 } from 'lucide-react';
import { Card } from './ui/card';

interface RoleSelectionProps {
  onRoleSelect: (role: 'patient' | 'doctor' | 'admin') => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const roles = [
    {
      id: 'patient' as const,
      icon: Heart,
      title: 'Patient',
      subtitle: 'Book appointments & track health',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      id: 'doctor' as const,
      icon: Stethoscope,
      title: 'Doctor',
      subtitle: 'Manage patients & consultations',
      color: 'from-green-500 to-emerald-400',
    },
    {
      id: 'admin' as const,
      icon: Building2,
      title: 'Admin',
      subtitle: 'Manage hospital & resources',
      color: 'from-indigo-500 to-blue-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo and Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-green-500 p-4 rounded-2xl shadow-lg">
              <Heart className="w-10 h-10 text-white" fill="white" />
            </div>
          </div>
          <h1 className="text-4xl mb-2 text-gray-800">Viksit Health</h1>
          <p className="text-gray-600">Advanced Healthcare Management System</p>
        </div>

        {/* Title */}
        <h2 className="text-center mb-8 text-gray-700">Choose Your Role</h2>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card
              key={role.id}
              onClick={() => onRoleSelect(role.id)}
              className="p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-300 bg-white"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`bg-gradient-to-br ${role.color} p-6 rounded-2xl shadow-lg`}>
                  <role.icon className="w-12 h-12 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-gray-800">{role.title}</h3>
                <p className="text-sm text-gray-600">{role.subtitle}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <p className="text-center mt-12 text-sm text-gray-500">
          Select your role to access your personalized dashboard
        </p>
      </div>
    </div>
  );
}
