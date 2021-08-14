import Sidebar from '@/components/sidebar';
import { useStoreCustomers } from '@/hooks/store';
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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

export default function StoreProducts() {
  const router = useRouter();
  const storeId = router.query.storeId as string;
  const { data: customers } = useStoreCustomers(storeId);

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
          <Heading>Customers</Heading>
          <Table mt={6} rounded="sm" boxShadow="md" variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone Number</Th>
                <Th isNumeric>Orders</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers?.map((customer, index) => (
                <Tr key={customer.id}>
                  <Td>{index + 1}</Td>
                  <Td>{customer.name}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{customer.phoneNumber}</Td>
                  <Td isNumeric>{customer._count?.orders}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Flex>
  );
}
