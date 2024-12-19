import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hooks';
import { Box, Stack } from '@mui/material';
import { createBanner } from 'src/store/action/settingActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

// Define schema for file uploads
export const BannerFormSchema = zod.object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    bannerImages: schemaHelper.file({ message: { required_error: 'Banner image is required!' } })
});

export function BannerCreateForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Define initial default values for creation
    const defaultValues = {
        name: '',
        bannerImages: '',
    };

    const methods = useForm({
        resolver: zodResolver(BannerFormSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setValue, watch, formState: { isSubmitting } } = methods;
    const values = watch();

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        
        // If multiple files are allowed, use a loop to append them all
        if (data.bannerImages) {
            formData.append('bannerImages', data.bannerImages);
        }

        setLoading(true);
        try {
            const response = await dispatch(createBanner(formData));
            if (response) {
                navigate('/settings/banner');
            }
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setLoading(false);
        }
    });


    const handleRemoveFile = useCallback(() => {
        setValue('bannerImages', null);
    }, [setValue]);

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Card>
                <CardHeader title="Create New Banner" />
                <Divider sx={{ mt: 1 }} />

                <Stack spacing={3} sx={{ p: 3 }}>
                    <Field.Text name="name" label="Banner Name" />

                    <Stack spacing={1.5}>
                        <Typography variant="subtitle2">Banner Image</Typography>

                        <Field.Upload 
                            name="bannerImages" 
                            maxSize={3145728} 
                            onDelete={handleRemoveFile} 
                        />
                    </Stack>

                    <Box display="flex" justifyContent="flex-end">
                        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                            Create Banner
                        </LoadingButton>
                    </Box>
                </Stack>
            </Card>
        </Form>
    );
}
