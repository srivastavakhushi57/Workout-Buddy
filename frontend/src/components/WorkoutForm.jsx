import { useState } from 'react';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const workout = { title, load, reps };

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        body: JSON.stringify(workout),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error || 'Failed to add workout');
        setEmptyFields(json.emptyFields || []);
      } else {
        setTitle('');
        setLoad('');
        setReps('');
        setError(null);
        setEmptyFields([]);
        dispatch({ type: 'CREATE_WORKOUT', payload: json });
      }
    } catch (err) {
      setError('Network error: Could not reach the server');
      setEmptyFields([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Exercise Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes('title') ? 'error' : ''}
        placeholder="e.g. Bench Press"
      />

      <label>Load (in Kgs):</label>
      <input
        type="number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes('load') ? 'error' : ''}
        placeholder="e.g. 25"
      />

      <label>Reps:</label>
      <input
        type="number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes('reps') ? 'error' : ''}
        placeholder="e.g. 10"
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Workout'}
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
