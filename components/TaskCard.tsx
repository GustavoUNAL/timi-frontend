import React from 'react';
import { Task } from '../pages/tasks'; 

interface Props {
  task: Task;
  onStart: () => void;
  onPause: () => void;
  onFinish: () => void;
  onDelete: () => void;
  formattedTime: string;
}

const TaskCard: React.FC<Props> = ({ task, onStart, onPause, onFinish, onDelete, formattedTime }) => {
  const { title, category, status, created_at, finished_at } = task;

    const formatDate = (dateString: string | undefined): string => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            console.error("Error parsing date:", error);
            return 'Invalid Date';
        }
    };


  // Color mappings for status
  const statusColors: Record<string, string> = {
    pending: 'bg-gray-400',
    in_progress: 'bg-blue-500',
    paused: 'bg-yellow-400',
    finished: 'bg-green-500',
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-72 flex flex-col border">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-700">
        <span className="font-medium">Category:</span> {category?.name || 'No category'}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-medium">Status:</span>{' '}
        <span className={`text-white px-2 py-1 rounded ${statusColors[status] || 'bg-gray-500'}`}>
          {status.replace('_', ' ')}
        </span>
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-medium">Time Spent:</span> {formattedTime}
      </p>
        <p className="text-sm text-gray-700">
            <span className="font-medium">Created At:</span> {formatDate(created_at)}
        </p>
        <p className="text-sm text-gray-700">
            <span className="font-medium">Finished At:</span> {formatDate(finished_at)}
        </p>

      <div className="flex gap-2 mt-4">
        {status === 'pending' || status === 'paused' ? (
          <button
            onClick={onStart}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Start
          </button>
        ) : null}
        {status === 'in_progress' ? (
          <button
            onClick={onPause}
            className="px-3 py-1 bg-yellow-400 text-white text-sm rounded hover:bg-yellow-500"
          >
            Pause
          </button>
        ) : null}
        {status !== 'finished' ? (
          <button
            onClick={onFinish}
            className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
          >
            Finish
          </button>
        ) : null}
        <button
          onClick={onDelete}
          className="ml-auto px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;