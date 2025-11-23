# Health Auth (Patient & Doctor) - MERN Stack

Full-stack app with signup/login for two user types (Patient, Doctor). After login, users are redirected to their dashboard and see the data they provided during signup (including profile picture).

## Tech Stack
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT in HTTP-only cookies
- File Uploads: Multer (stored locally in `backend/uploads`)
- Frontend: React + Vite, React Router, Axios

## Project Structure
```
backend/
  server.js
  package.json
  config/
    db.js
  controllers/
    authController.js
  middleware/
    auth.js
    upload.js
  models/
    User.js
  routes/
    authRoutes.js
  uploads/  (profile pictures)
frontend/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx
    pages/
      App.jsx
      Login.jsx
      Signup.jsx
      PatientDashboard.jsx
      DoctorDashboard.jsx
    components/
      ProtectedRoute.jsx
    services/
      api.js
      AuthContext.jsx
```

## Prerequisites
- Node.js LTS
- MongoDB running locally (or a MongoDB Atlas URI)

## Setup

1) Backend
```
cd backend
npm install
```
Create a `.env` in `backend/`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/health_auth
JWT_SECRET=supersecret
JWT_EXPIRES_IN=7d
FRONTEND_ORIGIN=http://localhost:5173
NODE_ENV=development
```
Run:
```
npm run dev
```

2) Frontend
```
cd ../frontend
npm install
```
Create a `.env` in `frontend/` (optional):
```
VITE_API_BASE_URL=http://localhost:5000
```
Run:
```
npm run dev
```

Open the frontend URL it prints (default `http://localhost:5173`).

## Features
- Signup fields:
  - First Name, Last Name
  - Profile Picture (local upload)
  - Username, Email (unique)
  - Password, Confirm Password (validated)
  - Address: line1, city, state, pincode
  - User Type: Patient or Doctor
- Login with Email + Password
- JWT stored as HTTP-only cookie
- Redirect after login:
  - Patient → `/dashboard/patient`
  - Doctor → `/dashboard/doctor`
- Dashboards show all stored user data, including uploaded profile image
- Logout clears auth cookie

## Notes
- Images are served from `http://localhost:5000/uploads/...`.
- In production, set secure cookie flags by setting `NODE_ENV=production` and using HTTPS and a proper `FRONTEND_ORIGIN`.

## API Endpoints
- `POST /api/auth/signup` (multipart/form-data)
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`


