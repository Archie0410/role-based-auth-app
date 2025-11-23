import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../services/AuthContext.jsx';

export default function BlogView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data.blog);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await api.delete(`/blogs/${id}`);
      navigate('/dashboard/doctor');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete blog');
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  if (error) {
    return <div className="card" style={{ color: 'red' }}>{error}</div>;
  }

  if (!blog) {
    return <div className="card">Blog post not found.</div>;
  }

  const isAuthor = user && user.id && blog.authorId === user.id.toString();

  return (
    <div className="card">
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '8px 16px', marginBottom: '16px' }}>
          ← Back
        </button>
      </div>

      {isAuthor && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            onClick={() => navigate(`/blogs/${id}/edit`)}
            style={{ padding: '8px 16px' }}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{ padding: '8px 16px', background: '#dc3545' }}
          >
            Delete
          </button>
        </div>
      )}

      {blog.isDraft && (
        <div style={{ background: '#fff3cd', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          <strong>DRAFT</strong> - This post is not visible to patients
        </div>
      )}

      <h1 style={{ marginBottom: '16px' }}>{blog.title}</h1>
      
      <div style={{ marginBottom: '16px' }}>
        <span style={{ background: '#e9ecef', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
          {blog.category}
        </span>
      </div>

      <img
        src={API_BASE_URL + blog.image}
        alt={blog.title}
        style={{
          width: '100%',
          maxHeight: '400px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginBottom: '24px'
        }}
      />

      <div style={{ marginBottom: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '4px' }}>
        <h3>Summary</h3>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{blog.summary}</p>
      </div>

      <div>
        <h3>Content</h3>
        <div style={{ fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {blog.content}
        </div>
      </div>

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #dee2e6', color: '#6c757d', fontSize: '14px' }}>
        Published: {new Date(blog.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}


