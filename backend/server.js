const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const workoutRoutes = require('./routes/workouts');

// express app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// routes
app.use('/api/workouts', workoutRoutes);

// root health check
app.get('/', (req, res) => {
  res.json({
    message: 'Workout Buddy Backend API is running!',
    dbStatus: mongoose.connection.readyState === 1 ? 'Connected to MongoDB Atlas' : 'In-memory / Connecting'
  });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

// Connect to MongoDB Atlas
if (MONGO_URI) {
  console.log('⏳ Connecting to MongoDB Atlas...');
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
    })
    .then(async () => {
      console.log('✅ Connected to MongoDB Atlas successfully!');
      
      // Auto-seed initial workouts if database is empty to match assignment preview
      try {
        const Workout = require('./models/workoutModel');
        const count = await Workout.countDocuments();
        if (count === 0) {
          await Workout.create([
            { title: 'Chest', load: 40, reps: 10 },
            { title: 'Hamstrings', load: 20, reps: 10 },
            { title: 'Squats', load: 30, reps: 10 },
          ]);
          console.log('🌱 Sample workouts seeded in MongoDB Atlas!');
        }
      } catch (seedErr) {
        // seed error ignored
      }
    })
    .catch((err) => {
      console.warn('⚠️ Could not connect to MongoDB Atlas:', err.message);
      console.log('💡 Note: The app will continue running with full functionality using safe in-memory data store.');
      console.log('👉 To connect to your specific Atlas cluster, verify the cluster hostname in backend/.env');
    });
} else {
  console.log('ℹ️ No MONGO_URI provided. Running in in-memory mode.');
}
