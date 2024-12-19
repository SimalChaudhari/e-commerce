import { useEffect } from 'react';
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field, schemaHelper } from 'src/components/hook-form';

export const NewAddressSchema = zod.object({
  state: zod.string().min(1, { message: 'State is required!' }),
  street_address: zod.string().min(1, { message: 'Address is required!' }),
  zip_code: zod.string().min(1, { message: 'Zip code is required!' }),
  mobile: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  country: schemaHelper.objectOrNull({
    message: { required_error: 'Country is required!' },
  }),
});

export function AddressNewForm({ open, onClose, onCreate, onEdit, editData }) {
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewAddressSchema),
    defaultValues: {
      state: '',
      street_address: '',
      zip_code: '',
      country: '',
      mobile: '',
    },
  });

  const { reset, handleSubmit, formState: { isSubmitting } } = methods;


    // Reset the form whenever `open` is true for a new address or `editData` changes
    useEffect(() => {
      if (open) {
        reset(editData || {}); // Reset form fields to empty for a new address, or prefill if editing
      }
    }, [open, editData, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editData) {
        onEdit(editData.id, data);
      } else {
        onCreate(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to submit address:', error);
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <Form methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{editData ? 'Edit Address' : 'New Address'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <Field.Phone name="mobile" label="Mobile" />
            </Box>
            <Field.Text name="street_address" label="Address" />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="state" label="State" />
              <Field.Text name="zip_code" label="Zip Code" />
            </Box>
            <Field.CountrySelect name="country" label="Country" placeholder="Choose a country" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {editData ? 'Update Address' : 'Deliver to this address'}
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
