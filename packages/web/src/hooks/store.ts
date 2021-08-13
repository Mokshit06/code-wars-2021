import { useQuery } from 'react-query';
import type { Store, Product, Page } from '@prisma/client';

export function useStore() {
  return useQuery<Store>('/store');
}

export function useStoreProducts() {
  return useQuery<Product[]>('/store/products');
}

export function useStorePages() {
  return useQuery<Page[]>('/store/pages');
}
