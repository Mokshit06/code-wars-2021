import Link from '@/components/link';
import { useStores } from '@/hooks/store';
import { Box } from '@chakra-ui/react';

export default function Stores() {
  const { data: stores } = useStores();

  return (
    <Box>
      {stores?.map(store => (
        <Link href={`/stores/${store.id}`} key={store.id}>
          <pre>{JSON.stringify(store, null, 2)}</pre>
        </Link>
      ))}
    </Box>
  );
}
