import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

const truncateSummary = (text, wordLimit = 15) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
};

export default function BlogList({ category, showMyBlogs = false }) {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, [category, showMyBlogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      let response;
      if (showMyBlogs) {
        response = await api.get('/blogs/my-blogs');
      } else if (category) {
        response = await api.get(`/blogs/category/${category}`);
      } else {
        response = await api.get('/blogs/published');
      }
      setBlogs(response.data.blogs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
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

  return (
    <div>
      {blogs.length === 0 ? (
        <div className="card">No blog posts found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {blogs.map(blog => (
            <div
              key={blog.id}
              className="card"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => navigate(`/blogs/${blog.id}`)}
            >
              <img
                src={API_BASE_URL + blog.image}
                alt={blog.title}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '12px'
                }}
              />
              <h3 style={{ margin: '0 0 8px 0' }}>{blog.title}</h3>
              <p style={{ color: '#666', fontSize: '14px', margin: '0 0 8px 0' }}>
                {truncateSummary(blog.summary, 15)}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                <span style={{ fontSize: '12px', color: '#999' }}>{blog.category}</span>
                {showMyBlogs && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {blog.isDraft && (
                      <span style={{ fontSize: '12px', color: '#ff9800', fontWeight: 'bold' }}>DRAFT</span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blogs/${blog.id}/edit`);
                      }}
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(blog.id);
                      }}
                      style={{ padding: '4px 8px', fontSize: '12px', background: '#dc3545' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


