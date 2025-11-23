import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';

export default function ProtectedRoute({ children, allowed }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="card">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowed && !allowed.includes(user.userType)) {
    return <Navigate to={user.userType === 'patient' ? '/dashboard/patient' : '/dashboard/doctor'} />;
  }
  return children;
}


