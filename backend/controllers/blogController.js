import pool from '../config/mysql.js';

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, category, summary, content, isDraft } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    if (!title || !category || !summary || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const validCategories = ['Mental Health', 'Heart Disease', 'Covid19', 'Immunization'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const authorId = req.user._id ? req.user._id.toString() : req.user.id;
    const [result] = await pool.query(
      `INSERT INTO blogs (title, image, category, summary, content, isDraft, authorId) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, image, category, summary, content, isDraft === 'true' || isDraft === true, authorId]
    );

    const [blog] = await pool.query('SELECT * FROM blogs WHERE id = ?', [result.insertId]);

    res.status(201).json({
      message: 'Blog post created successfully',
      blog: blog[0]
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all blogs by a doctor
export const getMyBlogs = async (req, res) => {
  try {
    const authorId = req.user._id ? req.user._id.toString() : req.user.id;
    const [blogs] = await pool.query(
      'SELECT * FROM blogs WHERE authorId = ? ORDER BY createdAt DESC',
      [authorId]
    );

    res.json({ blogs });
  } catch (error) {
    console.error('Get my blogs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all published blogs (for patients)
export const getPublishedBlogs = async (req, res) => {
  try {
    const [blogs] = await pool.query(
      'SELECT * FROM blogs WHERE isDraft = FALSE ORDER BY createdAt DESC'
    );

    res.json({ blogs });
  } catch (error) {
    console.error('Get published blogs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get published blogs by category
export const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const validCategories = ['Mental Health', 'Heart Disease', 'Covid19', 'Immunization'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const [blogs] = await pool.query(
      'SELECT * FROM blogs WHERE category = ? AND isDraft = FALSE ORDER BY createdAt DESC',
      [category]
    );

    res.json({ blogs });
  } catch (error) {
    console.error('Get blogs by category error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single blog post
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const [blogs] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);

    if (blogs.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const blog = blogs[0];
    const userId = req.user._id ? req.user._id.toString() : req.user.id;

    // If it's a draft, only the author can view it
    if (blog.isDraft && blog.authorId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ blog });
  } catch (error) {
    console.error('Get blog by id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a blog post
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, summary, content, isDraft } = req.body;

    // Check if blog exists and belongs to the user
    const [blogs] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (blogs.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    if (blogs[0].authorId !== userId) {
      return res.status(403).json({ message: 'You can only update your own posts' });
    }

    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (category) {
      const validCategories = ['Mental Health', 'Heart Disease', 'Covid19', 'Immunization'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (summary) {
      updateFields.push('summary = ?');
      updateValues.push(summary);
    }
    if (content) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (isDraft !== undefined) {
      updateFields.push('isDraft = ?');
      updateValues.push(isDraft === 'true' || isDraft === true);
    }
    if (req.file) {
      updateFields.push('image = ?');
      updateValues.push(`/uploads/${req.file.filename}`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateValues.push(id);
    await pool.query(
      `UPDATE blogs SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const [updatedBlogs] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    res.json({ message: 'Blog post updated successfully', blog: updatedBlogs[0] });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists and belongs to the user
    const [blogs] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (blogs.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const userId = req.user._id ? req.user._id.toString() : req.user.id;
    if (blogs[0].authorId !== userId) {
      return res.status(403).json({ message: 'You can only delete your own posts' });
    }

    await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

