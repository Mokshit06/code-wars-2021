import { useStoreProducts } from '@/hooks/store';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from '@/components/link';

export default function StoreProducts() {
  const router = useRouter();
  const storeId = router.query.storeId as string;
  const { data: products } = useStoreProducts(storeId);

  return (
    <Box>
      {products?.map(product => (
        <Link
          href={`/stores/${storeId}/products/${product.id}`}
          key={product.id}
        >
          <pre>{JSON.stringify(product, null, 2)}</pre>
        </Link>
      ))}
    </Box>
  );
}
