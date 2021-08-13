import {
  Flex,
  Box,
  Heading,
  Input,
  Button,
  useToast,
  Textarea,
} from '@chakra-ui/react';
import { Form, Formik, FormikProps, useField, FormikHelpers } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import * as yup from 'yup';
import Field from '@/components/field';
import api from '@/lib/api';

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
  const mutation = useMutation(async (values: Values) =>
    api.post('/store/products', values)
  );
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    await mutation.mutateAsync(values);

    toast({
      title: 'Product created',
      description: 'Your product has been created!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setSubmitting(false);
    router.push('/store/products');
  };

  return (
    <Flex flex={1} width="full" alignItems="center" justifyContent="center">
      <Head>
        <title>Add Product</title>
      </Head>
      <Box
        // m={8}
        // borderWidth={1}
        // p={8}
        width="full"
        maxWidth={{ md: '800px' }}
        // borderRadius={4}
        textAlign="center"
        // boxShadow="lg"
      >
        {/* <Box my={2} textAlign="center">
          <Heading>Add Product</Heading>
        </Box> */}
        {/* <Box mt={4}> */}
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          // validationSchema={createProductSchema}
          component={CreateProductForm}
        />
        {/* </Box> */}
      </Box>
    </Flex>
  );
}

function CreateProductForm({ isSubmitting, isValid }: FormikProps<Values>) {
  const [nameInput, nameMeta] = useField('name');
  const [descriptionInput, descriptionMeta, descriptionHelpers] =
    useField('description');
  const [availabilityInput, availabilityMeta] = useField('availability');
  const [skuInput, skuMeta] = useField('sku');
  const [priceInput, priceMeta] = useField('price');
  const [imagesInput, imagesMeta] = useField('images');

  return (
    <Form>
      <Flex flexWrap="wrap" justify="center" align="flex-start">
        <Box flex="2 2 48rem" minWidth="51%">
          <Box rounded="md" boxShadow="md" padding={5}>
            <Box flex="1 1 22rem">
              <Field meta={nameMeta} label="Name">
                <Input {...nameInput} placeholder="Black t-shirt" />
              </Field>
            </Box>
            <Box flex="1 1 22rem">
              <Field meta={descriptionMeta} label="Description">
                <Textarea
                  value={descriptionInput.value}
                  onChange={e => {
                    descriptionHelpers.setValue(e.target.value);
                  }}
                />
              </Field>
            </Box>
          </Box>
        </Box>
        <Box flex="1 1 24rem" minWidth="0"></Box>
        <Box flex="2 2 48rem" minWidth="51%"></Box>
        {/* <Field meta={nameMeta} label="Store name">
          <Input {...nameInput} />
        </Field>
        <Box my={6} mb={0} textAlign="right">
          <Button
            isLoading={isSubmitting}
            disabled={isSubmitting || !isValid}
            type="submit"
            py={6}
          >
            Enter my store
          </Button>
        </Box> */}
      </Flex>
    </Form>
  );
}

const createProductSchema = yup.object({
  name: yup
    .string()
    .typeError('Store name should be a string')
    .min(4, 'Store name should be of atleast 4 characters')
    .max(15, 'Store name cannot be longer than 10 characters')
    .trim()
    .required('Store name is required'),
  address: yup
    .string()
    .typeError('Address should be a string')
    .trim()
    .required('Address is required'),
  apartment: yup
    .string()
    .typeError('Apartment should be a string')
    .trim()
    .required('Apartment is required'),
  city: yup
    .string()
    .typeError('City should be a string')
    .trim()
    .required('City is required'),
  country: yup
    .string()
    .typeError('Country should be a string')
    .trim()
    .required('Country is required'),
  state: yup
    .string()
    .typeError('State should be a string')
    .trim()
    .required('State is required'),
  pinCode: yup
    .string()
    .typeError('PIN code should be a string')
    .matches(/^\d{6}$/, { message: 'PIN code is invalid' })
    .required('PIN code is required'),
  phoneNumber: yup
    .string()
    .typeError('Phone number should be a string')
    .matches(/^[6-9]\d{9}$/, { message: 'Phone number is invalid' })
    .required('Phone number is required'),
  website: yup
    .string()
    .typeError('Website should be a string')
    .url('Website should be a URL'),
});
