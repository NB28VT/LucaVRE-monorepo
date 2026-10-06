import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient.ts';

type DeleteHandlingDeficitParams = {
  id: string;
  workingSessionId: number;
};

async function deleteHandlingDeficit(params: DeleteHandlingDeficitParams): Promise<void> {
  await apiClient.delete(`/handling_deficits/${params.id}`);
}

export function useDeleteHandlingDeficit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHandlingDeficit,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['working_sessions', variables.workingSessionId, 'handling_deficits'],
      });
    },
  });
}
