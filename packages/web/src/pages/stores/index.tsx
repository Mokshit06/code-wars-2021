import Link from 'next/link';
import { useStores } from '@/hooks/store';
import { Box, Stack, Text, Flex, Heading } from '@chakra-ui/react';

export default function Stores() {
  const { data: stores } = useStores();

  return (
    <Flex flex={1} width="full" alignItems="center" justifyContent="center">
      <Box>
        <Heading>Stores</Heading>
        <Stack mt={4} direction="column" spacing={4}>
          {stores?.map(store => (
            <Link href={`/stores/${store.id}`} key={store.id} passHref>
              <Box as="a" py={4} px={6} rounded="md" boxShadow="md" w="400px">
                <Text fontWeight="500" fontSize="xl">
                  {store.name}
                </Text>
                <Text>{store.domain}.lvh.me:5000</Text>
              </Box>
            </Link>
          ))}
        </Stack>
      </Box>
    </Flex>
  );
}
