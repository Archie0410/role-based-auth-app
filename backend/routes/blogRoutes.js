import { Router } from 'express';
import upload from '../middleware/upload.js';
import { authRequired } from '../middleware/auth.js';
import {
  createBlog,
  getMyBlogs,
  getPublishedBlogs,
  getBlogsByCategory,
  getBlogById,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';

const router = Router();

// Doctor routes
router.post('/create', authRequired, upload.single('image'), createBlog);
router.get('/my-blogs', authRequired, getMyBlogs);
router.put('/:id', authRequired, upload.single('image'), updateBlog);
router.delete('/:id', authRequired, deleteBlog);

// Patient routes (published blogs only) - must come before /:id route
router.get('/published', getPublishedBlogs);
router.get('/category/:category', getBlogsByCategory);
router.get('/:id', authRequired, getBlogById);

export default router;

