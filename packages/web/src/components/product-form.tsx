import Field from '@/components/field';
import {
  Box,
  Button,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Textarea,
} from '@chakra-ui/react';
import { FieldArray, Form, useField, useFormikContext } from 'formik';
import React from 'react';

export type Values = {
  name: string;
  description: string;
  availability: number;
  sku: string;
  price: number;
  images: string[];
};

export default function ProductForm({ type }: { type: 'create' | 'update' }) {
  const [nameInput, nameMeta] = useField('name');
  const [descriptionInput, descriptionMeta, descriptionHelpers] =
    useField('description');
  const [availabilityInput, availabilityMeta, availabilityHelpers] =
    useField('availability');
  const [skuInput, skuMeta] = useField('sku');
  const [priceInput, priceMeta, priceHelpers] = useField('price');
  const { values, isSubmitting, isValid } = useFormikContext<Values>();

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
          {type === 'create' ? 'Create' : 'Update'} product
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
