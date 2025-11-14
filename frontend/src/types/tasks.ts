export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  parentTaskId?: string;
  parentTask?: Task;
  tags: string[];
  linkedEvents: string[];
  linkedNotes: string[];
  estimatedHours?: number;
  actualHours?: number;
  isImportant: boolean;
  isUrgent: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  progress?: number;
  dueDate?: string;
  startDate?: string;
  parentTaskId?: string;
  tags?: string[];
  linkedEvents?: string[];
  estimatedHours?: number;
  isImportant?: boolean;
  isUrgent?: boolean;
  notes?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  completedAt?: string;
  actualHours?: number;
}

export interface QueryTasksDto {
  status?: TaskStatus;
  priority?: TaskPriority;
  isImportant?: boolean;
  isUrgent?: boolean;
  tags?: string[];
  search?: string;
  parentOnly?: boolean;
}

export interface TaskStatistics {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
  overdue: number;
  completionRate: string;
}
