import { useState } from 'react';
import { useAuth } from '../services/AuthContext.jsx';
import BlogList from './BlogList.jsx';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (!user) return null;

  const categories = ['Mental Health', 'Heart Disease', 'Covid19', 'Immunization'];

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
          onClick={() => {
            setActiveTab('blogs');
            setSelectedCategory(null);
          }}
          style={{
            padding: '10px 20px',
            background: activeTab === 'blogs' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Blog Posts
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="card">
          <h2>Patient Dashboard</h2>
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
          <h2>Health Blog Posts</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedCategory(null)}
              style={{
                padding: '8px 16px',
                background: selectedCategory === null ? '#007bff' : '#e9ecef',
                color: selectedCategory === null ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  background: selectedCategory === cat ? '#007bff' : '#e9ecef',
                  color: selectedCategory === cat ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <BlogList category={selectedCategory} />
        </div>
      )}
    </div>
  );
}


