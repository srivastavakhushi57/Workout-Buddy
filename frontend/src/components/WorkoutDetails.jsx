import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { formatDistanceToNow } from 'date-fns';

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();

  const handleClick = async () => {
    try {
      const response = await fetch(`/api/workouts/${workout._id}`, {
        method: 'DELETE',
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'DELETE_WORKOUT', payload: json });
      } else {
        console.error('Failed to delete workout:', json.error);
      }
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  };

  const getRelativeTime = (date) => {
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'just now';
      return formatDistanceToNow(d, { addSuffix: true });
    } catch (e) {
      return 'just now';
    }
  };

  return (
    <div className="workout-details">
      <h4>{workout.title}</h4>
      <p>
        <strong>Load (in Kgs): </strong>
        {workout.load}
      </p>
      <p>
        <strong>Reps: </strong>
        {workout.reps}
      </p>
      <p className="created-at">{getRelativeTime(workout.createdAt)}</p>
      <button
        type="button"
        className="delete-btn"
        onClick={handleClick}
        title="Delete Workout"
        aria-label="Delete Workout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="trash-icon"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  );
};

export default WorkoutDetails;
