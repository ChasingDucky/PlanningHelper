import api from './api';
import type {
  CalendarEvent,
  CreateEventDto,
  UpdateEventDto,
  QueryEventsDto,
} from '@types/calendar';

export const calendarApi = {
  // 创建事件
  createEvent: (data: CreateEventDto): Promise<CalendarEvent> => {
    return api.post('/calendar/events', data);
  },

  // 查询事件列表
  getEvents: (params?: QueryEventsDto): Promise<CalendarEvent[]> => {
    return api.get('/calendar/events', { params });
  },

  // 获取单个事件
  getEvent: (id: string): Promise<CalendarEvent> => {
    return api.get(`/calendar/events/${id}`);
  },

  // 更新事件
  updateEvent: (id: string, data: UpdateEventDto): Promise<CalendarEvent> => {
    return api.patch(`/calendar/events/${id}`, data);
  },

  // 删除事件
  deleteEvent: (id: string): Promise<void> => {
    return api.delete(`/calendar/events/${id}`);
  },

  // 获取即将到来的事件
  getUpcomingEvents: (days?: number): Promise<CalendarEvent[]> => {
    return api.get('/calendar/events/upcoming', { params: { days } });
  },
};
