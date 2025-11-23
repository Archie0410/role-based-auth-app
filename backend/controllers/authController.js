import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (userId) => {
  const payload = { id: userId };
  const secret = process.env.JWT_SECRET || 'devsecret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      userType,
      address
    } = req.body;

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !userType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (!address?.line1 || !address?.city || !address?.state || !address?.pincode) {
      return res.status(400).json({ message: 'Address is incomplete' });
    }

    const existingUser = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let profilePicture = '';
    if (req.file) {
      profilePicture = `/uploads/${req.file.filename}`;
    }

    const user = await User.create({
      firstName,
      lastName,
      userType: userType.toLowerCase(),
      profilePicture,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash,
      address
    });

    const token = signToken(user._id);
    setTokenCookie(res, token);
    return res.status(201).json({ user: user.toPublicJSON() });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Signup failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    setTokenCookie(res, token);
    return res.json({ user: user.toPublicJSON() });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Login failed' });
  }
};

export const me = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.json({ user: req.user.toPublicJSON() });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to fetch user' });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  return res.json({ message: 'Logged out' });
};


