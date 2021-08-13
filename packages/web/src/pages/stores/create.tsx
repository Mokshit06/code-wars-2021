import { Flex, Box, Heading, Input, Button, useToast } from '@chakra-ui/react';
import { Form, Formik, FormikProps, useField, FormikHelpers } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import * as yup from 'yup';
import Field from '@/components/field';
import api from '@/lib/api';

const initialValues = {
  name: '',
  address: '',
  apartment: '',
  city: '',
  country: '',
  state: '',
  pinCode: '',
  phoneNumber: '',
  website: '',
};

type Values = typeof initialValues;

export default function CreateStore() {
  const toast = useToast();
  const router = useRouter();
  const mutation = useMutation(async (values: Values) =>
    api.post('/store', values)
  );
  const handleSubmit = async (
    values: Values,
    { setSubmitting }: FormikHelpers<Values>
  ) => {
    await mutation.mutateAsync(values);

    toast({
      title: 'Store created',
      description: 'Your store has been created!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setSubmitting(false);
    router.push('/store');
  };

  return (
    <Flex flex={1} width="full" alignItems="center" justifyContent="center">
      <Head>
        <title>Create Store</title>
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
          <Heading fontWeight="400">Create your store</Heading>
        </Box>
        <Box mt={4}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={createStoreSchema}
            component={CreateStoreForm}
          />
        </Box>
      </Box>
    </Flex>
  );
}

function CreateStoreForm({ isSubmitting, isValid }: FormikProps<Values>) {
  const [nameInput, nameMeta] = useField('name');
  const [addressInput, addressMeta] = useField('address');
  const [apartmentInput, apartmentMeta] = useField('apartment');
  const [cityInput, cityMeta] = useField('city');
  const [countryInput, countryMeta] = useField('country');
  const [stateInput, stateMeta] = useField('state');
  const [pinCodeInput, pinCodeMeta] = useField('pinCode');
  const [phoneNumberInput, phoneNumberMeta] = useField('phoneNumber');
  const [websiteInput, websiteMeta] = useField('website');

  return (
    <Form>
      <Field meta={nameMeta} label="Store name">
        <Input {...nameInput} />
      </Field>
      <Field meta={addressMeta} label="Address">
        <Input {...addressInput} />
      </Field>
      <Field meta={apartmentMeta} label="Apartment, house no., etc.">
        <Input {...apartmentInput} />
      </Field>
      <Field meta={cityMeta} label="City">
        <Input {...cityInput} />
      </Field>
      <Flex gridGap={4}>
        <Field meta={countryMeta} label="Country/region">
          <Input {...countryInput} />
        </Field>
        <Field meta={stateMeta} label="State">
          <Input {...stateInput} />
        </Field>
        <Field meta={pinCodeMeta} label="PIN code">
          <Input {...pinCodeInput} />
        </Field>
      </Flex>
      <Flex gridGap={4}>
        <Field meta={phoneNumberMeta} label="Phone">
          <Input {...phoneNumberInput} />
        </Field>
        <Field meta={websiteMeta} label="Business website (optional)">
          <Input {...websiteInput} />
        </Field>
      </Flex>
      <Box my={6} mb={0} textAlign="right">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting || !isValid}
          type="submit"
          py={6}
        >
          Enter my store
        </Button>
      </Box>
    </Form>
  );
}

const createStoreSchema = yup.object({
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
