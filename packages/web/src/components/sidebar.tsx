import { Stack, Box, Divider } from '@chakra-ui/react';
import Link from './link';

export default function Sidebar({ storeId }: { storeId: string }) {
  return (
    <Box width="250px" bg="gray.50">
      <Stack direction="column" mt={4}>
        <Link px={6} py={2} href={`/stores/${storeId}/theme`}>
          Theme
        </Link>
        <Divider />
        <Link px={6} py={2} href={`/stores/${storeId}/products`}>
          Products
        </Link>
        <Divider />
        <Link px={6} py={2} href={`/stores/${storeId}/customers`}>
          Customers
        </Link>
      </Stack>
    </Box>
  );
}
