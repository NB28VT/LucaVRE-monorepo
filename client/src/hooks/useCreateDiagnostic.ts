import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient.ts';
import type { DiagnosticResponse, SetupRecommendations } from '@/types/diagnostic.ts';

async function createDiagnostic(workingSessionId: number): Promise<SetupRecommendations> {
  const { data } = await apiClient.post<DiagnosticResponse>(
    `/working_sessions/${workingSessionId}/diagnostic`,
  );
  return data.recommendations;
}

export function useCreateDiagnostic() {
  return useMutation({
    mutationFn: createDiagnostic,
  });
}
