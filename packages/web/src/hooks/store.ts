import { useQuery } from 'react-query';
import type { Store, Product, Page } from '@prisma/client';

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
