import { Router } from 'express';
import upload from '../middleware/upload.js';
import { authRequired } from '../middleware/auth.js';
import { signup, login, me, logout } from '../controllers/authController.js';

const router = Router();

router.post('/signup', upload.single('profilePicture'), signup);
router.post('/login', login);
router.get('/me', authRequired, me);
router.post('/logout', authRequired, logout);

export default router;


