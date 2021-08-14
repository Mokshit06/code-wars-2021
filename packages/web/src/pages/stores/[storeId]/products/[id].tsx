import ProductForm, { Values } from '@/components/product-form';
import { useStoreProduct } from '@/hooks/store';
import api from '@/lib/api';
import { Box, Flex, Heading, useToast } from '@chakra-ui/react';
import { Formik, FormikHelpers } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';

export default function UpdateProduct() {
  const toast = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const storeId = router.query.storeId as string;
  const productId = router.query.id as string;
  const { data: product, isSuccess } = useStoreProduct(storeId, productId);
  const mutation = useMutation(
    async (values: Values) =>
      api.put(`/stores/${storeId}/products/${productId}`, values),
    {
      onSuccess() {
        queryClient.invalidateQueries([
          '/stores',
          storeId,
          'products',
          productId,
        ]);
        toast({
          title: 'Product updated',
          description: 'Your product has been updated!',
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

  if (!isSuccess) return null;

  const initialValues: Values = {
    availability: product!.availability ?? 0,
    description: product!.description ?? '',
    images: product!.images,
    name: product!.name,
    price: product!.price,
    sku: product!.sku ?? '',
  };

  return (
    <Flex flex={1} width="full" alignItems="center" justifyContent="center">
      <Head>
        <title>Update Product</title>
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
          <Heading fontWeight="400">Update {product?.name}</Heading>
        </Box>
        <Box mt={4}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={updateProductSchema}
            component={props => <ProductForm {...props} type="update" />}
          />
        </Box>
      </Box>
    </Flex>
  );
}

const updateProductSchema = yup.object({
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
