import Link from '@/components/link';
import Sidebar from '@/components/sidebar';
import { useStoreProducts } from '@/hooks/store';
import {
  Box,
  Flex,
  Heading,
  Table,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

export default function StoreProducts() {
  const router = useRouter();
  const storeId = router.query.storeId as string;
  const { data: products } = useStoreProducts(storeId);

  return (
    <Flex flex={1}>
      <Sidebar storeId={storeId} />
      <Flex
        flex={1}
        width="full"
        alignItems="flex-start"
        justifyContent="center"
      >
        <Box w="full" my={8} mx={6} maxW="1100px">
          <Flex alignItems="center" justifyContent="space-between">
            <Heading>Products</Heading>
            <Link href={`/stores/${storeId}/products/create`}>
              <Button as="a">Create</Button>
            </Link>
          </Flex>
          <Table mt={6} rounded="sm" boxShadow="md" variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Product</Th>
                <Th>Status</Th>
                <Th>Inventory</Th>
                <Th>SKU</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products?.map((product, index) => (
                <Tr
                  key={product.id}
                  onClick={() =>
                    router.push(`/stores/${storeId}/products/${product.id}`)
                  }
                  _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                >
                  <Td>{index + 1}</Td>
                  <Td>{product.name}</Td>
                  <Td>
                    <Tag>Active</Tag>
                  </Td>
                  <Td>{product.availability} in stock</Td>
                  <Td>{product.sku}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Flex>
  );
}
