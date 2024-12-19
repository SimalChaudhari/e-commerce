import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    Card, CardHeader, Divider, Stack, Typography, Switch,
    FormControlLabel, Grid,
    Button
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { deleteProduct, editProduct } from 'src/store/action/productActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

export default function ProductNewEditForm({ currentProduct }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // States for applyToAll flags
    const [applyToAllProductImages, setApplyToAllProductImages] = useState(false);
    const [applyToAllDimensionalFiles, setApplyToAllDimensionalFiles] = useState(false);

    const defaultValues = useMemo(() => ({
        id: currentProduct?.id || '',
        productImages: currentProduct?.productImages || '',
        dimensionalFiles: currentProduct?.dimensionalFiles || '',
    }), [currentProduct]);

    const methods = useForm({ defaultValues });
    const { reset, handleSubmit, setValue, watch } = methods;
    const values = watch();

    useEffect(() => {
        if (currentProduct) {
            reset(defaultValues);
        }
    }, [currentProduct, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();

        // Add applyToAll flags to form data
        formData.append('applyToAllProductImages', applyToAllProductImages);
        formData.append('applyToAllDimensionalFiles', applyToAllDimensionalFiles);

        const existingImages = values.productImages || [];
        existingImages.forEach((image) => {
            formData.append('productImages', image);
        });

        const existingDimensionalFiles = values.dimensionalFiles || [];
        existingDimensionalFiles.forEach((file) => {
            formData.append('dimensionalFiles', file);
        });

        try {
            setLoading(true);
            const res = await dispatch(editProduct(currentProduct.id, formData));
            if (res) {
                navigate('/products');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error updating product:', error);
            setLoading(false);
        }
    });

    const handleCancel = () => {
        navigate(-1);
    }

    const handleRemoveFile = useCallback(async (file, fieldName) => {
        try {
            const isLocalFile = file instanceof File;
            const imageField = fieldName === 'productImages' ? 'productImages' : 'dimensionalFiles';

            if (isLocalFile) {
                setValue(fieldName, values[fieldName].filter((item) => item !== file));
            } else {
                const result = await dispatch(deleteProduct(currentProduct.id, { [imageField]: [file] }));
                if (result) {
                    setValue(fieldName, values[fieldName].filter((item) => item !== file));
                }
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    }, [dispatch, currentProduct.id, setValue, values]);

    const handleRemoveAllFiles = useCallback(async (fieldName) => {
        try {
            const imageField = fieldName === 'productImages' ? 'productImages' : 'dimensionalFiles';
            const remoteFiles = values[fieldName].filter(file => !(file instanceof File));

            if (remoteFiles.length > 0) {
                const result = await dispatch(deleteProduct(currentProduct.id, { [imageField]: remoteFiles }));
                if (result) {
                    setValue(fieldName, []);
                }
            } else {
                setValue(fieldName, []);
            }
        } catch (error) {
            console.error('Error deleting all images:', error);
        }
    }, [dispatch, currentProduct.id, setValue, values]);

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
                <Card>
                    <Stack spacing={2} sx={{ p: 3 }}>
                        <Grid container spacing={4}>
                            {/* Product Images Section */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Product Images</Typography>
                                <Divider sx={{ borderStyle: 'dashed', my: 1 }} />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={applyToAllProductImages}
                                            onChange={(e) => setApplyToAllProductImages(e.target.checked)}
                                        />
                                    }
                                    label="Apply this images setting to all items that belong to the same Sub-Group 2 category"
                                />

                                <Field.Upload
                                    multiple
                                    thumbnail
                                    name="productImages"
                                    maxSize={3145728}
                                    onRemove={(file) => handleRemoveFile(file, 'productImages')}
                                    onRemoveAll={() => handleRemoveAllFiles('productImages')}
                                />
                            </Grid>

                            {/* Dimensional Files Section */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6">Dimensional Files</Typography>
                                <Divider sx={{ borderStyle: 'dashed', my: 1 }} />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={applyToAllDimensionalFiles}
                                            onChange={(e) => setApplyToAllDimensionalFiles(e.target.checked)}
                                        />
                                    }
                                    label="Apply this Files setting to all items that belong to the same Sub-Group 2 category"
                                />

                                <Field.SingleFile
                                    multiple
                                    thumbnail
                                    name="dimensionalFiles"
                                    maxSize={3145728}
                                    onRemove={(file) => handleRemoveFile(file, 'dimensionalFiles')}
                                    onRemoveAll={() => handleRemoveAllFiles('dimensionalFiles')}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </Card>


                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <LoadingButton type="submit" variant="contained" loading={loading}>
                        Submit
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
