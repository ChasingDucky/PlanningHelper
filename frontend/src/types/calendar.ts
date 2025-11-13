export enum EventCategory {
  WORK = 'work',
  STUDY = 'study',
  PERSONAL = 'personal',
  MEETING = 'meeting',
  DEADLINE = 'deadline',
  OTHER = 'other',
}

export enum RepeatFrequency {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export interface RepeatRule {
  endDate?: string;
  interval?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export interface ReminderSettings {
  enabled: boolean;
  minutesBefore: number[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  category: EventCategory;
  tags: string[];
  repeatFrequency: RepeatFrequency;
  repeatRule?: RepeatRule;
  reminderSettings?: ReminderSettings;
  color: string;
  location?: string;
  completed: boolean;
  linkedNotes: string[];
  linkedTasks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  category?: EventCategory;
  tags?: string[];
  repeatFrequency?: RepeatFrequency;
  repeatRule?: RepeatRule;
  reminderSettings?: ReminderSettings;
  color?: string;
  location?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  completed?: boolean;
}

export interface QueryEventsDto {
  startDate?: string;
  endDate?: string;
  category?: EventCategory;
  tags?: string[];
  search?: string;
}
