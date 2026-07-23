import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient.ts';
import type { CreateWorkingSessionParams, WorkingSession } from '@/types/workingSession.ts';

async function createWorkingSession(params: CreateWorkingSessionParams): Promise<WorkingSession> {
  const { data } = await apiClient.post<WorkingSession>('/working_sessions', {
    working_session: { car_id: params.carId, track_id: params.trackId },
  });
  return data;
}

export function useCreateWorkingSession() {
  return useMutation({
    mutationFn: createWorkingSession,
  });
}
