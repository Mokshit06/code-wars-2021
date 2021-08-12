import { Flex, Box, Tabs, TabList, Tab, TabPanels } from '@chakra-ui/react';
import Head from 'next/head';

export default function Store() {
  return (
    <Flex flex={1} width="full" alignItems="center" justifyContent="center">
      <Head>
        <title>Create Class | Zola</title>
      </Head>
      <Box
        borderWidth={1}
        p={8}
        width="full"
        // maxWidth={['360px', null, null, '430px', null]}
        borderRadius={4}
        textAlign="center"
        boxShadow="lg"
      >
        <Tabs>
          <TabList>
            <Tab>Add product</Tab>
            <Tab>Customise theme</Tab>
          </TabList>
          <TabPanels></TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
}
