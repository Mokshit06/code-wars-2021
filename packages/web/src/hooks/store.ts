import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { Store, Product, Page } from '@prisma/client';
import api from '@/lib/api';

export function useStores() {
  return useQuery<Store[]>('/stores');
}

export function useStore(id: string) {
  return useQuery<Store>(['/stores', id], { enabled: !!id });
}

export function useStoreProducts(id: string) {
  return useQuery<Product[]>(['/stores', id, 'products'], { enabled: !!id });
}

export function useStorePages(id: string) {
  return useQuery<Page[]>(['/stores', id, 'pages'], {
    enabled: !!id,
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
}

export function useChangeTheme(id: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (theme: string) => api.post(`/stores/${id}/theme`, { theme }),
    {
      onSuccess() {
        queryClient.invalidateQueries(['/stores', id]);
      },
    }
  );
}
