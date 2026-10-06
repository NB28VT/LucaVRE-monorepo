import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient.ts';
import type { WorkingSession } from '@/types/workingSession.ts';

async function fetchWorkingSessions(): Promise<WorkingSession[]> {
  const { data } = await apiClient.get<WorkingSession[]>('/working_sessions');
  return data;
}

export function useWorkingSessions() {
  return useQuery({
    queryKey: ['working_sessions'],
    queryFn: fetchWorkingSessions,
  });
}
