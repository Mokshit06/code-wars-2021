import { Flex, Heading, HStack, Spacer, Button } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { useLogout, useUser } from '../hooks/auth';
import Link from './link';

export default function Layout({ children }: { children: ReactNode }) {
  const user = useUser();
  const logout = useLogout();

  return (
    <Flex minH="100vh" flexDirection="column">
      <Flex
        as="nav"
        align="center"
        wrap="wrap"
        padding="1.3rem"
        zIndex={1000}
        boxShadow="md"
      >
        <Flex align="center" mr={5}>
          <Heading mb={{ base: 3, sm: 0 }} as="h1" size="lg">
            Dukaan
          </Heading>
        </Flex>

        <Spacer />

        <HStack
          spacing={5}
          mr={5}
          width={{ md: 'auto', base: 'full' }}
          alignItems="center"
        >
          <Link href="/">Home</Link>
          {user.isAuthenticated ? (
            <>
              <Link href="/stores">Stores</Link>
              <Button onClick={() => logout()}>Logout</Button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </HStack>
      </Flex>
      {children}
    </Flex>
  );
}
