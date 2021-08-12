import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import type { QueryFunction, QueryKey } from 'react-query';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '../components/layout';
import api from '../lib/api';

const defaultQueryFn: QueryFunction<unknown, QueryKey> = async ({
  queryKey,
}) => {
  try {
    const { data } = await api.get(queryKey[0] as string);
    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error);
  }
};

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            queryFn: defaultQueryFn,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
export default MyApp;
