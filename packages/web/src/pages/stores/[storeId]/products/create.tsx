import Field from '@/components/field';
import api from '@/lib/api';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import {
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
  useField,
  useFormikContext,
} from 'formik';
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
            component={CreateProductForm}
          />
        </Box>
      </Box>
    </Flex>
  );
}

function CreateProductForm({ isSubmitting, isValid }: FormikProps<Values>) {
  const [nameInput, nameMeta] = useField('name');
  const [descriptionInput, descriptionMeta, descriptionHelpers] =
    useField('description');
  const [availabilityInput, availabilityMeta, availabilityHelpers] =
    useField('availability');
  const [skuInput, skuMeta] = useField('sku');
  const [priceInput, priceMeta, priceHelpers] = useField('price');
  const [imagesInput, imagesMeta] = useField('images');
  const { values } = useFormikContext<Values>();

  return (
    <Form>
      <Field meta={nameMeta} label="Name">
        <Input {...nameInput} />
      </Field>
      <Field meta={descriptionMeta} label="Description">
        <Textarea
          value={descriptionInput.value}
          onChange={e => {
            descriptionHelpers.setValue(e.target.value);
          }}
        />
      </Field>
      <Field meta={availabilityMeta} label="Availability">
        <NumberInput
          min={0}
          value={Number(availabilityInput.value || 0)}
          onChange={(_, val) => availabilityHelpers.setValue(val)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Field>
      <Field meta={skuMeta} label="SKU">
        <Input {...skuInput} />
      </Field>
      <Field meta={priceMeta} label="Price">
        <InputGroup>
          <InputLeftAddon>₹</InputLeftAddon>
          <NumberInput
            w="full"
            min={0}
            value={Number(priceInput.value || 0)}
            onChange={(_, val) => priceHelpers.setValue(val)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </InputGroup>
      </Field>
      <FieldArray name="images">
        {({ push }) => (
          <Box mt={4}>
            <FormLabel>Images</FormLabel>
            <Box>
              {values.images.map((image, index) => (
                <ImageInput index={index} key={index} />
              ))}
            </Box>
            <Box my={2}>
              <Button onClick={() => push('')}>Add Image</Button>
            </Box>
          </Box>
        )}
      </FieldArray>
      <Box my={6} mb={0} textAlign="right">
        <Button
          isLoading={isSubmitting}
          disabled={isSubmitting || !isValid}
          type="submit"
          py={6}
        >
          Create product
        </Button>
      </Box>
    </Form>
  );
}

function ImageInput({ index }: { index: number }) {
  const [imageInput, imageMeta] = useField(`images[${index}]`);

  return (
    <Field meta={imageMeta}>
      <Input {...imageInput} />
    </Field>
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
