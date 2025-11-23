# Setup and Run Instructions

## Prerequisites

Before running the application, make sure you have the following installed:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
3. **MySQL** - [Download](https://dev.mysql.com/downloads/mysql/)

## Step-by-Step Setup

### 1. Install MongoDB

- Download and install MongoDB Community Edition
- Start MongoDB service:
  - **Windows**: MongoDB should start automatically as a service
  - **Mac/Linux**: Run `mongod` or `brew services start mongodb-community`
- Verify MongoDB is running on `mongodb://127.0.0.1:27017`

### 2. Install MySQL

- Download and install MySQL Server
- During installation, set a root password (or leave it empty for development)
- Start MySQL service:
  - **Windows**: MySQL should start automatically as a service
  - **Mac/Linux**: Run `brew services start mysql` or `sudo systemctl start mysql`
- Verify MySQL is running on `localhost:3306`

### 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Banao/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory:
   ```bash
   # Create .env file (Windows PowerShell)
   @"
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
   "@ | Out-File -FilePath .env -Encoding utf8
   ```

   Or manually create `.env` file with:
   ```
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

   **Important**: Replace `your_mysql_password` with your actual MySQL root password (or leave empty if no password).

4. Generate a secure JWT secret (optional but recommended):
   ```bash
   node utils/generateJWT.js secret
   ```
   Copy the generated secret and update `JWT_SECRET` in your `.env` file.

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The server should start on `http://localhost:5000`
   - MongoDB connection will be established automatically
   - MySQL database and tables will be created automatically on first run

### 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Banao/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend` directory:
   ```bash
   # Create .env file (Windows PowerShell)
   @"
   VITE_API_BASE_URL=http://localhost:5000
   "@ | Out-File -FilePath .env -Encoding utf8
   ```

   Or manually create `.env` file with:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend should start on `http://localhost:5173`

## Running the Application

1. **Start MongoDB** (if not already running)
2. **Start MySQL** (if not already running)
3. **Start Backend**: `cd Banao/backend && npm run dev`
4. **Start Frontend**: `cd Banao/frontend && npm run dev` (in a new terminal)

## Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## First Time Setup

1. **Create an account**:
   - Go to http://localhost:5173/signup
   - Sign up as either a "doctor" or "patient"
   - Upload a profile picture (optional)

2. **Login**:
   - Use your credentials to log in
   - You'll be redirected to your dashboard based on your user type

3. **For Doctors**:
   - Click on "My Blog Posts" tab
   - Click "Create New Post" to add blog posts
   - You can save posts as drafts or publish them

4. **For Patients**:
   - Click on "Blog Posts" tab
   - View all published blog posts
   - Filter by category (Mental Health, Heart Disease, Covid19, Immunization)

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if MongoDB is listening on port 27017
- Verify `MONGO_URI` in `.env` file

### MySQL Connection Error
- Make sure MySQL is running
- Verify MySQL credentials in `.env` file
- Check if MySQL is listening on port 3306
- The database `health_blog` will be created automatically

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: Vite will automatically use the next available port

### CORS Errors
- Make sure `FRONTEND_ORIGIN` in backend `.env` matches your frontend URL
- Default is `http://localhost:5173`

## Database Information

- **MongoDB Database**: `health_auth`
  - Collection: `users` (created automatically)

- **MySQL Database**: `health_blog` (created automatically)
  - Table: `blogs` (created automatically)

## Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `node utils/generateJWT.js secret` - Generate JWT secret
- `node utils/generateJWT.js token <userId>` - Generate test token

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build


