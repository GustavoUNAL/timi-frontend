export type TaskStatus = 'pending' | 'in_progress' | 'paused' | 'finished';

export interface Task {
  id: number;
  title: string;
  category_id: number;
  time_spent: number;
  status: TaskStatus;
  current_start: number;
}
