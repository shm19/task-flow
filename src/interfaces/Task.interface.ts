export interface Task {
  id: number;
  title: string;
  priority: string;
  description?: string;
  storyPoints?: number;
  startDate?: string;
  dueDate?: string;
  columnId?: number;
  assigneeId?: number;
}
