# Health Auth (Patient & Doctor) - MERN Stack with Blog System

Full-stack healthcare application with role-based authentication for two user types (Patient, Doctor) and an integrated blog system. Doctors can create and manage health-related blog posts, while patients can view published articles categorized by health topics.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), MySQL (mysql2)
- **Auth**: JWT in HTTP-only cookies
- **File Uploads**: Multer (stored locally in `backend/uploads`)
- **Frontend**: React + Vite, React Router, Axios
- **Databases**: 
  - MongoDB - User authentication and user data
  - MySQL - Blog posts storage

## Project Structure

```
backend/
  server.js
  package.json
  config/
    db.js          (MongoDB connection)
    mysql.js       (MySQL connection & initialization)
  controllers/
    authController.js
    blogController.js
  middleware/
    auth.js
    upload.js
  models/
    User.js
  routes/
    authRoutes.js
    blogRoutes.js
  utils/
    generateJWT.js
  uploads/         (profile pictures & blog images)
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
      BlogCreate.jsx
      BlogEdit.jsx
      BlogList.jsx
      BlogView.jsx
    components/
      ProtectedRoute.jsx
    services/
      api.js
      AuthContext.jsx
```

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** running locally (or a MongoDB Atlas URI)
- **MySQL** Server installed and running

## Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
MONGO_URI=mongodb://127.0.0.1:27017/health_auth
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=health_blog
```

**Note**: Replace `your_mysql_password` with your actual MySQL root password (or leave empty if no password).

**Generate a secure JWT secret** (optional but recommended):
```bash
node utils/generateJWT.js secret
```

Run:
```bash
npm run dev
```

The MySQL database and tables will be created automatically on first run.

### 2. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` (optional):

```env
VITE_API_BASE_URL=http://localhost:5000
```

Run:
```bash
npm run dev
```

Open the frontend URL it prints (default `http://localhost:5173`).

## Features

### Authentication & User Management
- **Signup fields**:
  - First Name, Last Name
  - Profile Picture (local upload)
  - Username, Email (unique)
  - Password, Confirm Password (validated)
  - Address: line1, city, state, pincode
  - User Type: Patient or Doctor
- **Login** with Email + Password
- **JWT** stored as HTTP-only cookie
- **Redirect after login**:
  - Patient → `/dashboard/patient`
  - Doctor → `/dashboard/doctor`
- **Dashboards** show all stored user data, including uploaded profile image
- **Logout** clears auth cookie

### Blog System

#### For Doctors:
- ✅ Create new blog posts with:
  - Title
  - Image upload
  - Category selection (Mental Health, Heart Disease, Covid19, Immunization)
  - Summary
  - Content
- ✅ Save posts as **drafts** or publish immediately
- ✅ View all their blog posts (published and drafts)
- ✅ Edit their own blog posts
- ✅ Delete their own blog posts
- ✅ Update draft status

#### For Patients:
- ✅ View all published blog posts
- ✅ Filter blogs by category:
  - Mental Health
  - Heart Disease
  - Covid19
  - Immunization
- ✅ View individual blog posts with full content
- ✅ Blog list displays:
  - Post title
  - Post image
  - Summary (truncated to 15 words with "...")
  - Category badge

## Blog Categories

1. **Mental Health** - Articles about mental wellness, therapy, and psychological health
2. **Heart Disease** - Information about cardiovascular health and heart conditions
3. **Covid19** - Updates and information about COVID-19
4. **Immunization** - Vaccination information and immunization schedules

## Database Information

- **MongoDB Database**: `health_auth`
  - Collection: `users` (created automatically)

- **MySQL Database**: `health_blog` (created automatically)
  - Table: `blogs` (created automatically with schema)
    - Fields: id, title, image, category, summary, content, isDraft, authorId, createdAt, updatedAt

## API Endpoints

### Authentication
- `POST /api/auth/signup` (multipart/form-data) - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### Blog Posts (Doctors)
- `POST /api/blogs/create` - Create a new blog post (requires auth, doctor only)
- `GET /api/blogs/my-blogs` - Get all blogs by the logged-in doctor (requires auth)
- `GET /api/blogs/:id` - Get a single blog post by ID (requires auth)
- `PUT /api/blogs/:id` - Update a blog post (requires auth, author only)
- `DELETE /api/blogs/:id` - Delete a blog post (requires auth, author only)

### Blog Posts (Patients)
- `GET /api/blogs/published` - Get all published blog posts
- `GET /api/blogs/category/:category` - Get published blogs by category
- `GET /api/blogs/:id` - Get a single blog post (drafts only visible to author)

## Notes

- Images are served from `http://localhost:5000/uploads/...`
- Blog images and profile pictures are stored in `backend/uploads/`
- In production, set secure cookie flags by setting `NODE_ENV=production` and using HTTPS and a proper `FRONTEND_ORIGIN`
- The MySQL database and tables are automatically created when the server starts
- Draft blog posts are only visible to the author (doctor who created them)

## Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `node utils/generateJWT.js secret` - Generate a secure JWT secret
- `node utils/generateJWT.js token <userId>` - Generate a test JWT token

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Getting Started

1. **Start MongoDB** and **MySQL** services
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev` (in a new terminal)
4. **Create an account** as a Doctor or Patient
5. **For Doctors**: Navigate to "My Blog Posts" tab to create your first blog post
6. **For Patients**: Navigate to "Blog Posts" tab to view published articles

## License

This project is open source and available for educational purposes.
