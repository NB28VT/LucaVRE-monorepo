import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient.ts';
import type {
  HandlingCharacteristic,
  Location,
  Phase,
  Symptom,
} from '@/types/handlingCharacteristic.ts';

type HandlingDeficitResponse = {
  id: number;
  location: Location;
  phase: Phase | null;
  symptom: Symptom;
};

type CreateHandlingDeficitParams = {
  workingSessionId: number;
  location: Location;
  phase: Phase | null;
  symptom: Symptom;
};

async function createHandlingDeficit(
  params: CreateHandlingDeficitParams,
): Promise<HandlingCharacteristic> {
  const { data } = await apiClient.post<HandlingDeficitResponse>(
    `/working_sessions/${params.workingSessionId}/handling_deficits`,
    {
      handling_deficit: {
        location: params.location,
        symptom: params.symptom,
        phase: params.phase,
      },
    },
  );

  return {
    id: String(data.id),
    location: data.location,
    phase: data.phase,
    symptom: data.symptom,
  };
}

export function useCreateHandlingDeficit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHandlingDeficit,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['working_sessions', variables.workingSessionId, 'handling_deficits'],
      });
    },
  });
}
