import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Card,
    Stack,
    Divider,
    Typography,
    Button,
    Grid,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { createProduct } from 'src/store/action/productActions'; // Replace with your create action

const ProductSchema = zod.object({
    itemName: zod.string().min(1, { message: 'Item Name is required!' }),
    alias: zod.string().optional(),
    partNo: zod.string().optional(),
    description: zod.string().optional(),
    group: zod.string().min(1, { message: 'Group is required!' }),
    subGroup1: zod.string().optional(),
    subGroup2: zod.string().optional(),
    baseUnit: zod.string().optional(),
    alternateUnit: zod.string().optional(),
    conversion: zod.string().optional(),
    denominator: zod.string().optional(),
    sellingPriceDate: zod.string().optional(),
    sellingPrice: zod.number().min(0, { message: 'Price must be greater than or equal to 0!' }),
    gstApplicable: zod.string().optional(),
    gstApplicableDate: zod.string().optional(),
    taxability: zod.string().optional(),
    gstRate: zod.number().min(0, { message: 'GST Rate must be greater than or equal to 0!' }),
    productImages: zod.array(zod.any()).optional(),
    dimensionalFiles: zod.array(zod.any()).optional(),
});

export default function ProductCreateForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const defaultValues = useMemo(
        () => ({
            itemName: '',
            alias: '',
            partNo: '',
            description: '',
            group: '',
            subGroup1: '',
            subGroup2: '',
            baseUnit: '',
            alternateUnit: '',
            conversion: '',
            denominator: '',
            sellingPriceDate: '',
            sellingPrice: 0,
            gstApplicable: '',
            gstApplicableDate: '',
            taxability: '',
            gstRate: 0,
            productImages: [],
            dimensionalFiles: [],
        }),
        []
    );

    const methods = useForm({
        resolver: zodResolver(ProductSchema),
        defaultValues,
    });

    const { handleSubmit, watch } = methods;
    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
                data[key].forEach((value) => formData.append(key, value));
            } else {
                formData.append(key, data[key]);
            }
        });

        try {
            setLoading(true);
            const res = await dispatch(createProduct(formData)); // Use the create action
            if (res) {
                navigate('/products'); // Redirect to the product list page
            }
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    });

    const renderFields = (
        <Card>
            <Stack spacing={3} sx={{ p: 3 }}>
                <Typography variant="h5">Create Product</Typography>
                <Divider />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="itemName" label="Item Name" required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="alias" label="Alias" />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Field.Text name="description" label="Description" multiline rows={3} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="partNo" label="Part Number" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="group" label="Group" required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="subGroup1" label="Sub-Group 1" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="subGroup2" label="Sub-Group 2" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="baseUnit" label="Base Unit" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="alternateUnit" label="Alternate Unit" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="conversion" label="Conversion" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="denominator" label="Denominator" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="sellingPriceDate" label="Selling Price Date" type="date" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="sellingPrice" label="Selling Price" type="number" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="gstApplicable" label="GST Applicable" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="gstApplicableDate" label="GST Applicable Date" type="date" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="taxability" label="Taxability" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Text name="gstRate" label="GST Rate" type="number" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Upload
                            multiple
                            thumbnail
                            name="productImages"
                            label="Product Images"
                            maxSize={3145728}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Field.Upload
                            multiple
                            thumbnail
                            name="dimensionalFiles"
                            label="Dimensional Files"
                            maxSize={3145728}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Card>
    );

    const renderActions = (
        <Stack spacing={3} direction="row" justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate('/products')}>
                Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
                Create Product
            </LoadingButton>
        </Stack>
    );

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
                {renderFields}
                {renderActions}
            </Stack>
        </Form>
    );
}
