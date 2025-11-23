import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';
import BlogList from './BlogList.jsx';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) return null;

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'profile' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'blogs' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          My Blog Posts
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="card">
          <h2>Doctor Dashboard</h2>
          <div style={{ display: 'flex', gap: 24 }}>
            <img className="avatar" src={user.profilePicture ? (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + user.profilePicture : 'https://via.placeholder.com/120'} alt="Profile" />
            <table>
              <tbody>
                <tr><td><strong>Name</strong></td><td>{user.firstName} {user.lastName}</td></tr>
                <tr><td><strong>Username</strong></td><td>{user.username}</td></tr>
                <tr><td><strong>Email</strong></td><td>{user.email}</td></tr>
                <tr><td><strong>Type</strong></td><td>{user.userType}</td></tr>
                <tr><td><strong>Address</strong></td><td>{user.address.line1}, {user.address.city}, {user.address.state} - {user.address.pincode}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'blogs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>My Blog Posts</h2>
            <button
              onClick={() => navigate('/blogs/create')}
              style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              + Create New Post
            </button>
          </div>
          <BlogList showMyBlogs={true} />
        </div>
      )}
    </div>
  );
}


