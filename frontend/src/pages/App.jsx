import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import PatientDashboard from './PatientDashboard.jsx';
import DoctorDashboard from './DoctorDashboard.jsx';
import BlogCreate from './BlogCreate.jsx';
import BlogView from './BlogView.jsx';
import BlogEdit from './BlogEdit.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { useAuth } from '../services/AuthContext.jsx';

const NavBar = () => {
  const { user, logout } = useAuth();
  return (
    <div className="container">
      <div className="nav">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <strong>Health Auth</strong>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
            Login
          </NavLink>
          <NavLink to="/signup" className={({ isActive }) => (isActive ? 'active' : '')}>
            Signup
          </NavLink>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ fontSize: 14, color: '#c5cfdb' }}>
                {user.firstName} {user.lastName} ({user.userType})
              </span>
              <button onClick={logout}>Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const { user } = useAuth();
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to={user ? (user.userType === 'patient' ? '/dashboard/patient' : '/dashboard/doctor') : '/login'} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard/patient"
            element={
              <ProtectedRoute allowed={['patient']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/doctor"
            element={
              <ProtectedRoute allowed={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/create"
            element={
              <ProtectedRoute allowed={['doctor']}>
                <BlogCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <ProtectedRoute>
                <BlogView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/:id/edit"
            element={
              <ProtectedRoute allowed={['doctor']}>
                <BlogEdit />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}


