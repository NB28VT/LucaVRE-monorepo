import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient.ts';
import type { Car } from '@/types/car.ts';

async function fetchCars(): Promise<Car[]> {
  const { data } = await apiClient.get<Car[]>('/cars');
  return data;
}

export function useCars() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: fetchCars,
  });
}
