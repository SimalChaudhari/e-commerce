import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    Card, CardHeader, Divider, Stack, Box, Typography, InputAdornment, Switch,
    FormControlLabel, Grid
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

export default function VendorNewEditForm({ currentVendor }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // State to manage the loader

    const defaultValues = useMemo(() => ({
        slno: currentVendor?.slno || '',
        name: currentVendor?.name || '',
        alias: currentVendor?.alias || '',
        active: currentVendor?.active || '',
        parent: currentVendor?.parent || '',
        address: currentVendor?.address || '',
        country: currentVendor?.country || '',
        state: currentVendor?.state || '',
        pincode: currentVendor?.pincode || '',
        contactperson: currentVendor?.contactperson || '',
        phone: currentVendor?.phone || '',
        email: currentVendor?.email || '',
        pan: currentVendor?.pan || '',
        gsttype: currentVendor?.gsttype || '',
        gstno: currentVendor?.gstno || '',
        gstdetails: currentVendor?.gstdetails || ''
    }), [currentVendor]);

    const methods = useForm({
        defaultValues,
    });

    const { reset, handleSubmit, setValue, watch } = methods;
    const values = watch();

    useEffect(() => {
        if (currentVendor) {
            reset(defaultValues);
        }
    }, [currentVendor, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        console.log("🚀 ~ onSubmit ~ data:", data);
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>

                <Card>
                    <CardHeader title="Vendor Edit" sx={{ py: 2 }} />
                    <Divider />
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="slno" label="SL No" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="name" label="Name" disabled />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Field.Text name="email" label="Email" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="phone" label="Phone" disabled />
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <Field.Text name="address" label="Address" disabled multiline rows={2} />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Field.Text name="country" label="Country" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="state" label="State" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="pincode" label="Pincode" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="alias" label="Alias" disabled />
                            </Grid>


                            <Grid item xs={12} sm={6}>
                                <Field.Text name="parent" label="Parent" disabled />
                            </Grid>





                            <Grid item xs={12} sm={6}>
                                <Field.Text name="contactperson" label="Contact Person" disabled />
                            </Grid>


                            <Grid item xs={12} sm={6}>
                                <Field.Text name="pan" label="PAN" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="gsttype" label="GST Type" disabled />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Field.Text name="gstno" label="GST No" disabled />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Field.Text name="active" label="Active" disabled />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Field.Text name="gstdetails" label="GST Details" disabled multiline rows={2} />
                            </Grid>

                        </Grid>
                    </Box>
                </Card>

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <LoadingButton type="submit" variant="contained" loading={loading}>
                        Submit
                    </LoadingButton>
                </Stack>

            </Stack>
        </Form>
    );
}
