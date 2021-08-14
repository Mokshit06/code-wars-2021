import { useStoreProducts } from '@/hooks/store';
import {
  Box,
  Button,
  CSSObject,
  Divider,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  TabProps,
  Tabs,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const selectedStyle: CSSObject = {
  bg: 'white',
  borderRightColor: 'transparent',
  borderLeft: '2px solid',
  borderLeftColor: 'gray.600',
};
const tabProps: TabProps = {
  borderBottom: '1px solid',
  bg: 'gray.50',
  borderRight: '1px solid white',
  borderColor: 'gray.200',
  margin: '0 -1px',
  width: '13rem',
  _selected: selectedStyle,
  _focus: { boxShadow: 'none !important' },
};

export default function Store() {
  const router = useRouter();
  const storeId = router.query.storeId as string;
  const { data: storeProducts } = useStoreProducts(storeId);

  return (
    <Flex flex={1} width="full" alignItems="center" justifyContent="center">
      <Head>
        <title>Store</title>
      </Head>
      <Box
        width="full"
        maxWidth={{ md: '45rem' }}
        rounded="md"
        textAlign="center"
        boxShadow="xs"
      >
        <Box p="5">
          <Heading as="h2" fontWeight="400">
            Start your own business!
          </Heading>
        </Box>
        <Divider />
        <Tabs orientation="vertical" variant="unstyled" size="lg">
          <TabList
            margin="0 0 0 1px"
            borderRight="1px solid"
            borderColor="gray.200"
          >
            <Tab {...tabProps}>Add product</Tab>
            <Tab {...tabProps}>Customise theme</Tab>
          </TabList>
          <TabPanels width="100%" textAlign="left">
            <TabPanel minHeight="16rem" maxWidth="25rem" padding="1.5rem 2rem">
              {storeProducts?.length ? (
                <>
                  <Text as="h3" mb="8px" fontSize="lg" fontWeight="500">
                    You’ve added a product
                  </Text>
                  <Text>Add more products or move on to another tip.</Text>
                  <Link href={`/stores/${storeId}/products/create`} passHref>
                    <Button my="1.5rem" as="a">
                      Add another product
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Text as="h3" mb="8px" fontSize="lg" fontWeight="500">
                    Add your first product
                  </Text>
                  <Text>Add the first product in your new store.</Text>
                  <Link href={`/stores/${storeId}/products/create`} passHref>
                    <Button my="1.5rem" as="a">
                      Add first product
                    </Button>
                  </Link>
                </>
              )}
            </TabPanel>
            <TabPanel minHeight="16rem" maxWidth="25rem" padding="1.5rem 2rem">
              <Text as="h3" mb="8px" fontSize="lg" fontWeight="500">
                Edit the look and feel of your online store
              </Text>
              <Text>
                Choose a theme and add your logo, colors, and images to reflect
                your brand.
              </Text>
              <Link href={`/stores/${storeId}/theme`} passHref>
                <Button my="1.5rem" as="a">
                  Customize theme
                </Button>
              </Link>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
}
