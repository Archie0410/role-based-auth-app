import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient',
    address: { line1: '', city: '', state: '', pincode: '' }
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateAddress = (key, value) => setForm((f) => ({ ...f, address: { ...f.address, [key]: value } }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('firstName', form.firstName);
      fd.append('lastName', form.lastName);
      fd.append('username', form.username);
      fd.append('email', form.email);
      fd.append('password', form.password);
      fd.append('confirmPassword', form.confirmPassword);
      fd.append('userType', form.userType);
      fd.append('address[line1]', form.address.line1);
      fd.append('address[city]', form.address.city);
      fd.append('address[state]', form.address.state);
      fd.append('address[pincode]', form.address.pincode);
      if (file) fd.append('profilePicture', file);
      const user = await signup(fd);
      navigate(user.userType === 'patient' ? '/dashboard/patient' : '/dashboard/doctor');
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      {error ? <div className="error">{error}</div> : null}
      <form onSubmit={onSubmit}>
        <div className="row">
          <div>
            <label>First Name</label>
            <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required placeholder="John" />
          </div>
          <div>
            <label>Last Name</label>
            <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required placeholder="Doe" />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Username</label>
            <input value={form.username} onChange={(e) => update('username', e.target.value)} required placeholder="john_doe" />
          </div>
          <div>
            <label>User Type</label>
            <select value={form.userType} onChange={(e) => update('userType', e.target.value)}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
        </div>
        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required placeholder="you@example.com" />
        <div className="row">
          <div>
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required placeholder="Password" />
          </div>
          <div>
            <label>Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} required placeholder="Confirm Password" />
          </div>
        </div>
        <label>Profile Picture</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <h3>Address</h3>
        <label>Line 1</label>
        <input value={form.address.line1} onChange={(e) => updateAddress('line1', e.target.value)} required placeholder="123 Main St" />
        <div className="row">
          <div>
            <label>City</label>
            <input value={form.address.city} onChange={(e) => updateAddress('city', e.target.value)} required placeholder="Mumbai" />
          </div>
          <div>
            <label>State</label>
            <input value={form.address.state} onChange={(e) => updateAddress('state', e.target.value)} required placeholder="Maharashtra" />
          </div>
        </div>
        <label>Pincode</label>
        <input value={form.address.pincode} onChange={(e) => updateAddress('pincode', e.target.value)} required placeholder="400001" />
        <button type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
      </form>
    </div>
  );
}


