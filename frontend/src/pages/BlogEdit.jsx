import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

export default function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    summary: '',
    content: '',
    isDraft: false
  });
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const categories = ['Mental Health', 'Heart Disease', 'Covid19', 'Immunization'];

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setFetching(true);
      const response = await api.get(`/blogs/${id}`);
      const blog = response.data.blog;
      setFormData({
        title: blog.title,
        category: blog.category,
        summary: blog.summary,
        content: blog.content,
        isDraft: blog.isDraft
      });
      setExistingImage(blog.image);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('summary', formData.summary);
      data.append('content', formData.content);
      data.append('isDraft', formData.isDraft);
      if (image) {
        data.append('image', image);
      }

      await api.put(`/blogs/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/blogs/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog post');
    } finally {
      setLoading(false);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  if (fetching) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div className="card">
      <h2>Edit Blog Post</h2>
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label>Image {image ? '(New)' : '(Current)'}</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ maxWidth: '200px', marginTop: '8px', borderRadius: '4px' }}
            />
          ) : existingImage && (
            <img
              src={API_BASE_URL + existingImage}
              alt="Current"
              style={{ maxWidth: '200px', marginTop: '8px', borderRadius: '4px' }}
            />
          )}
        </div>

        <div>
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Summary *</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows="3"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label>Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="10"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              name="isDraft"
              checked={formData.isDraft}
              onChange={handleChange}
            />
            Save as Draft
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
            {loading ? 'Updating...' : 'Update Blog Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/blogs/${id}`)}
            style={{ padding: '10px 20px', background: '#6c757d' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


