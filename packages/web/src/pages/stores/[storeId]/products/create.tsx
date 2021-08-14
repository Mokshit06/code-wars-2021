import ProductForm from '@/components/product-form';
import Sidebar from '@/components/sidebar';
import api from '@/lib/api';
import { Box, Flex, Heading, useToast } from '@chakra-ui/react';
import { Formik, FormikHelpers } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';

const initialValues = {
  name: '',
  description: '',
  availability: 0,
  sku: '',
  price: 0,
  images: [],
};

type Values = typeof initialValues;

export default function CreateProduct() {
  const toast = useToast();
  const router = useRouter();
  const storeId = router.query.storeId as string;
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (values: Values) => api.post(`/stores/${storeId}/products`, values),
    {
      onSuccess() {
        queryClient.invalidateQueries(['/stores', storeId, 'products']);
        toast({
          title: 'Product created',
          description: 'Your product has been created!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    await mutation.mutateAsync(values);
    setSubmitting(false);
    router.push(`/stores/${storeId}/products`);
  };

  return (
    <Flex flex={1}>
      <Sidebar storeId={storeId} />
      <Flex flex={1} width="full" alignItems="center" justifyContent="center">
        <Head>
          <title>Create Product</title>
        </Head>
        <Box
          m={8}
          borderWidth={1}
          p={8}
          width="full"
          maxWidth={{ base: '380px', sm: '600px', md: '680px' }}
          borderRadius={4}
          textAlign="center"
          boxShadow="lg"
        >
          <Box my={2} textAlign="center">
            <Heading fontWeight="400">Add a Product</Heading>
          </Box>
          <Box mt={4}>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={createProductSchema}
              component={props => <ProductForm {...props} type="create" />}
            />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
}

const createProductSchema = yup.object({
  name: yup
    .string()
    .typeError('Product name should be a string')
    .trim()
    .required('Product name is required'),
  description: yup
    .string()
    .typeError('Description should be a string')
    .trim()
    .required('Description is required'),
  availability: yup
    .number()
    .typeError('Availability should be a number')
    .min(0)
    .required(),
  sku: yup.string().trim().typeError('SKU should be a string'),
  price: yup
    .number()
    .typeError('Price should be a number')
    .required('Price is required'),
  images: yup
    .array()
    .of(
      yup
        .string()
        .typeError('Image should be a string')
        .trim()
        .url('Image should be a valid URL')
    ),
});
