import { useState } from 'react';
import { RoleSelection } from './components/RoleSelection';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';

type Role = 'patient' | 'doctor' | 'admin' | null;

export default function App() {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleBack = () => {
    setSelectedRole(null);
  };

  // Render based on selected role
  if (selectedRole === 'patient') {
    return <PatientDashboard onBack={handleBack} />;
  }

  if (selectedRole === 'doctor') {
    return <DoctorDashboard onBack={handleBack} />;
  }

  if (selectedRole === 'admin') {
    return <AdminDashboard onBack={handleBack} />;
  }

  // Default: Show role selection
  return <RoleSelection onRoleSelect={handleRoleSelect} />;
}
