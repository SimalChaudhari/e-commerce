import { z as zod } from 'zod';
import React, { useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Form, Field } from 'src/components/hook-form'; // Custom components for form handling
import { useDispatch } from 'react-redux';
import { createAddress, updateAddress } from 'src/store/action/addressActions';
import { useFetchUserData } from '../components';

// Validation schema for address creation using Zod
export const AddressSchema = zod.object({
    street_address: zod.string().min(1, { message: 'Address is required!' }),
    city: zod.string().min(1, { message: 'City is required!' }),
    state: zod.string().min(1, { message: 'State is required!' }),
    zip_code: zod.string().min(1, { message: 'Zip code is required!' }),
    country: zod.string().min(1, { message: 'Country is required!' }),
});

// Address Form Component for both Create and Update
export function AddressForm({ open, onClose, addressData = null, userId }) {
    const dispatch = useDispatch();
    const { fetchData } = useFetchUserData(); // Custom hook to fetch address data
    
    // Default values for create or update
    const defaultValues = useMemo(() => ({
        street_address: addressData?.street_address || '',
        city: addressData?.city || '',
        state: addressData?.state || '',
        zip_code: addressData?.zip_code || '',
        country: addressData?.country || '',
    }), [addressData]);

    const methods = useForm({
        resolver: zodResolver(AddressSchema),
        defaultValues,
    });

    const { reset, handleSubmit, formState: { isSubmitting }, setValue } = methods;

    // Populate the form with existing data if it's for update
    useEffect(() => {
        if (addressData) {
            Object.keys(defaultValues).forEach(key => setValue(key, defaultValues[key]));
        }
    }, [addressData, setValue, defaultValues]);

    // Handle form submission
    const onSubmit = async (data) => {
        const formattedData = { ...data, userId };
        const response = addressData
            ? await dispatch(updateAddress(addressData.id, formattedData)) // Update existing address
            : await dispatch(createAddress(formattedData)); // Create new address

        if (response) {
            reset();
            onClose();
            fetchData(); // Refresh address list
        }
    };

    return (
        <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
            <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>{addressData ? 'Update Address' : 'Add Address'}</DialogTitle>

                <DialogContent>
                    <Alert variant="outlined" severity="info" sx={{ mb: 3 }}>
                        {addressData ? 'Update the details below.' : 'Please fill in the details to create a new address.'}
                    </Alert>

                    <Box display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} gap={3}>
                        <Field.Text name="street_address" label="Street Address" />
                        <Field.Text name="city" label="City" />
                        <Field.Text name="state" label="State" />
                        <Field.Text name="zip_code" label="Zip Code" />
                        <Field.CountrySelect
                            fullWidth
                            name="country"
                            label="Country"
                            placeholder="Choose a country"
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={onClose}>Cancel</Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                        {addressData ? 'Update' : 'Create'}
                    </LoadingButton>
                </DialogActions>
            </Form>
        </Dialog>
    );
}
