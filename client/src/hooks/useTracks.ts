import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient.ts';
import type { Track } from '@/types/track.ts';

async function fetchTracks(): Promise<Track[]> {
  const { data } = await apiClient.get<Track[]>('/tracks');
  return data;
}

export function useTracks() {
  return useQuery({
    queryKey: ['tracks'],
    queryFn: fetchTracks,
  });
}
