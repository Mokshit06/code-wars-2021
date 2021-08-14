import { useMutation, useQuery, useQueryClient } from 'react-query';
import type { Store, Product, Page } from '@prisma/client';
import api from '@/lib/api';
import { useToast } from '@chakra-ui/react';

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
  const toast = useToast();
  const { data: store } = useStore(id);

  return useMutation(
    async (theme: string) => api.post(`/stores/${id}/theme`, { theme }),
    {
      onSuccess() {
        toast({
          title: 'Theme updated',
          description: `${store?.name}'s theme has been updated!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        queryClient.invalidateQueries(['/stores', id]);
      },
    }
  );
}

export function useUpdateTheme(id: string) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data: store } = useStore(id);

  return useMutation(
    async (pages: any[]) => api.put(`/stores/${id}/theme`, { pages }),
    {
      onSuccess() {
        toast({
          title: 'Theme updated',
          description: `${store?.name}'s theme has been updated!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        queryClient.invalidateQueries(['/stores', id]);
      },
    }
  );
}
