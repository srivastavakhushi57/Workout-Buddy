# Workout Buddy (MERN Stack with React Context & useReducer)

A full-stack MERN application for tracking daily workouts with real-time CRUD operations, responsive UI, robust error handling, and React Context + `useReducer` state management.

---

## 📸 Preview & Requirements Checklist

- [x] **Page Title**: `Workout Budyyy`
- [x] **Two-column Responsive Layout**: Workout cards list on the left, "Add a New Workout" form on the right.
- [x] **Mobile Responsive**: Stacked layout with zero horizontal overflow.
- [x] **Workout Card Details**:
  - Title (e.g., Chest, Hamstrings, Squats) in emerald teal `#1aac83`
  - Load (in Kgs)
  - Reps
  - Relative creation time (e.g., *"about 23 hours ago"* via `date-fns`)
  - Delete (🗑️) button
- [x] **Backend REST API**:
  - `GET /api/workouts` — Fetch all workouts sorted by latest first
  - `POST /api/workouts` — Create a new workout with validation
  - `DELETE /api/workouts/:id` — Delete a workout by ID
- [x] **State Management**: React Context API + `useReducer` with actions:
  - `SET_WORKOUTS`
  - `CREATE_WORKOUT`
  - `DELETE_WORKOUT`
- [x] **Error Handling**:
  - Backend validation returning HTTP 400 with `{ error, emptyFields }`
  - Frontend error alert displayed near the form
  - Visual field highlighting (red borders) for missing fields

---

## 🗂️ Project Structure

```
Workout-Buddy/
├── backend/
│   ├── controllers/
│   │   └── workoutController.js   # CRUD logic & validation
│   ├── models/
│   │   └── workoutModel.js        # Mongoose Schema
│   ├── routes/
│   │   └── workouts.js            # REST API Routes
│   ├── .env                       # MongoDB Atlas URI & Port
│   ├── package.json
│   └── server.js                  # Express App & Mongo Connection
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Header ("Workout Budyyy")
│   │   │   ├── WorkoutDetails.jsx # Workout Card with delete & relative time
│   │   │   └── WorkoutForm.jsx    # Add Workout form with validation & error highlight
│   │   ├── context/
│   │   │   └── WorkoutsContext.jsx# React Context + useReducer
│   │   ├── hooks/
│   │   │   └── useWorkoutsContext.js # Custom hook
│   │   ├── pages/
│   │   │   └── Home.jsx           # Responsive 2-column home page
│   │   ├── App.jsx
│   │   ├── index.css              # Styled matching assignment preview
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             # API Proxy to localhost:4000
├── package.json                   # Root orchestrator
├── start-dev.js                   # Single-command launcher for VS Code
└── README.md
```

---

## 🚀 Quick Start (Single Command)

1. Open the project root folder in **VS Code**:
   ```bash
   cd Workout-Buddy
   ```

2. Run the development command:
   ```bash
   npm run dev
   ```

> 💡 **What this does automatically:**
> - Checks and installs any missing dependencies for both backend and frontend.
> - Starts the backend server on `http://localhost:4000`.
> - Starts the Vite React frontend on `http://localhost:5173`.
> - Automatically opens `http://localhost:5173` in your default web browser!

---

## ⚙️ MongoDB Atlas Configuration

Your MongoDB Atlas credentials are pre-configured in `backend/.env`:

```env
PORT=4000
MONGO_URI=mongodb+srv://srivastavakhushi615_db_user:Duniya2025JK@cluster0.mongodb.net/workout-buddy?retryWrites=true&w=majority
```

> **Important**:
> 1. In MongoDB Atlas, ensure your Network Access whitelist allows connections from anywhere (`0.0.0.0/0`) or your current IP.
> 2. If your Atlas cluster has a specific cluster hostname (e.g., `cluster0.abcde.mongodb.net`), paste that exact hostname in `backend/.env`.
> 3. Even if Atlas is offline or connecting, the app includes a safe in-memory data store with pre-populated sample workouts so the app works seamlessly out of the box!

---

## 🛠️ Running Services Individually (Optional)

### Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://localhost:4000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🧪 Testing REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/workouts` | Get all workouts (latest first) |
| `GET` | `/api/workouts/:id` | Get single workout by ID |
| `POST` | `/api/workouts` | Create workout (Body: `{ "title": "Chest", "load": 40, "reps": 10 }`) |
| `DELETE` | `/api/workouts/:id` | Delete workout by ID |
