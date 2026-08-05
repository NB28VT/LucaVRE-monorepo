import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient.ts';
import type { HandlingCharacteristic, Location, Phase, Symptom } from '@/types/handlingCharacteristic.ts';

type HandlingDeficitResponse = {
  id: number;
  location: Location;
  phase: Phase | null;
  symptom: Symptom;
};

async function fetchHandlingDeficits(workingSessionId: number): Promise<HandlingCharacteristic[]> {
  const { data } = await apiClient.get<HandlingDeficitResponse[]>(
    `/working_sessions/${workingSessionId}/handling_deficits`,
  );
  return data.map((row) => ({
    id: String(row.id),
    location: row.location,
    phase: row.phase,
    symptom: row.symptom,
  }));
}

export function useHandlingDeficits(workingSessionId: number | null) {
  return useQuery({
    queryKey: ['working_sessions', workingSessionId, 'handling_deficits'],
    queryFn: () => fetchHandlingDeficits(workingSessionId!),
    enabled: workingSessionId != null,
  });
}
