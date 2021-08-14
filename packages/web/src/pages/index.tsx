import { useUser } from '@/hooks/auth';
import { Box, Button, Flex, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import Head from 'next/head';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { FaRocket } from 'react-icons/fa';
import coverImage from '../../public/assets/cover-card-dark.png';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useUser();

  const getStarted = () => {
    if (isAuthenticated) {
      router.push('/stores');
    } else {
      router.push('/login');
    }
  };

  return (
    <Flex
      flex={1}
      justifyContent="center"
      alignItems="center"
      position="relative"
      overflow="hidden"
    >
      <Head>
        <title>Home | CW</title>
      </Head>
      {/* <Image
        src="assets/triangle.svg"
        alt=""
        position="absolute"
        width="40%"
        top={0}
        right={0}
        zIndex={-1}
      /> */}
      <SimpleGrid
        width={{ base: '85%', sm: '80%' }}
        mx="auto"
        height="full"
        alignContent="center"
        gap={4}
        columns={{ base: 1, sm: 1, md: 2 }}
      >
        <Flex
          height="full"
          width="90%"
          flexDir="column"
          justifyContent="center"
        >
          <Heading fontSize="3rem">CW</Heading>
          <Text fontSize="1.6rem" mt={6}>
            The best e-commerce platform which to start your business online
          </Text>
          <Button
            rightIcon={<FaRocket size="0.9rem" />}
            href="/dashboard"
            size="lg"
            width="fit-content"
            mt={6}
            onClick={getStarted}
          >
            Get Started
          </Button>
        </Flex>
        <Box height="full" width="full">
          <NextImage alt="" src={coverImage} objectFit="contain" />
        </Box>
      </SimpleGrid>
    </Flex>
  );
}
