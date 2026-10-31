const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

// In-memory fallback store if MongoDB Atlas is connecting or offline
let inMemoryWorkouts = [
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Chest',
    load: 40,
    reps: 10,
    createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Hamstrings',
    load: 20,
    reps: 10,
    createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: new mongoose.Types.ObjectId().toString(),
    title: 'Squats',
    load: 30,
    reps: 10,
    createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// GET all workouts (latest first)
const getWorkouts = async (req, res) => {
  try {
    if (isDbConnected()) {
      const workouts = await Workout.find({}).sort({ createdAt: -1 });
      return res.status(200).json(workouts);
    }

    // In-memory fallback
    const sorted = [...inMemoryWorkouts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.status(200).json(sorted);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
      }

      const workout = await Workout.findById(id);
      if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
      }

      return res.status(200).json(workout);
    }

    // In-memory fallback
    const found = inMemoryWorkouts.find((w) => w._id === id);
    if (!found) {
      return res.status(404).json({ error: 'No such workout' });
    }
    res.status(200).json(found);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST a new workout
const createWorkout = async (req, res) => {
  const { title, load, reps } = req.body;

  let emptyFields = [];

  if (!title || typeof title !== 'string' || !title.trim()) {
    emptyFields.push('title');
  }
  if (load === undefined || load === null || load === '' || isNaN(Number(load))) {
    emptyFields.push('load');
  }
  if (reps === undefined || reps === null || reps === '' || isNaN(Number(reps))) {
    emptyFields.push('reps');
  }

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all the fields', emptyFields });
  }

  try {
    if (isDbConnected()) {
      const workout = await Workout.create({
        title: title.trim(),
        load: Number(load),
        reps: Number(reps),
      });
      return res.status(200).json(workout);
    }

    // In-memory fallback
    const newWorkout = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: title.trim(),
      load: Number(load),
      reps: Number(reps),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryWorkouts.unshift(newWorkout);
    res.status(200).json(newWorkout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
      }

      const workout = await Workout.findOneAndDelete({ _id: id });
      if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
      }

      return res.status(200).json(workout);
    }

    // In-memory fallback
    const index = inMemoryWorkouts.findIndex((w) => w._id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'No such workout' });
    }
    const [deleted] = inMemoryWorkouts.splice(index, 1);
    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
      }

      const workout = await Workout.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
      );

      if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
      }

      return res.status(200).json(workout);
    }

    // In-memory fallback
    const index = inMemoryWorkouts.findIndex((w) => w._id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'No such workout' });
    }
    inMemoryWorkouts[index] = {
      ...inMemoryWorkouts[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.status(200).json(inMemoryWorkouts[index]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
};
