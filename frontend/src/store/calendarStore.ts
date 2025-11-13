import { create } from 'zustand';
import type { CalendarEvent } from '@/types/calendar';
import { calendarApi } from '@services/calendar';

interface CalendarStore {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  fetchEvents: (params?: any) => Promise<void>;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  removeEvent: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  loading: false,
  error: null,

  fetchEvents: async (params?) => {
    set({ loading: true, error: null });
    try {
      const events = await calendarApi.getEvents(params);
      set({ events, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addEvent: (event) => {
    set((state) => ({ events: [...state.events, event] }));
  },

  updateEvent: (id, updatedEvent) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event,
      ),
    }));
  },

  removeEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
