import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Event } from '../types';

interface EventFilters {
  startDate?: string;
  endDate?: string;
}

export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get<Event[]>(`/events?${params.toString()}`);
      return response.data;
    }
  });
} 