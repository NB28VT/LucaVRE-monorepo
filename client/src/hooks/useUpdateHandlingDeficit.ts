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

type UpdateHandlingDeficitParams = {
  id: string;
  workingSessionId: number;
  location: Location;
  phase: Phase | null;
  symptom: Symptom;
};

async function updateHandlingDeficit(
  params: UpdateHandlingDeficitParams,
): Promise<HandlingCharacteristic> {
  const { data } = await apiClient.patch<HandlingDeficitResponse>(
    `/handling_deficits/${params.id}`,
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

export function useUpdateHandlingDeficit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHandlingDeficit,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['working_sessions', variables.workingSessionId, 'handling_deficits'],
      });
    },
  });
}
