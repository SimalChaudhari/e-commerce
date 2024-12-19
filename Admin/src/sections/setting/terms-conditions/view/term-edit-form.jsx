
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Card, CardHeader, Divider, Stack, Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

import { createTerm, termList } from 'src/store/action/settingActions';

const TermSchema = zod.object({
    content: zod.string().min(1, 'Term & Condition is required!'),
});

export default function TermEditForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // Initialize form
    const methods = useForm({
        resolver: zodResolver(TermSchema),
        defaultValues: { content: '' },
    });

    const { reset, handleSubmit } = methods;

    // Fetch existing Terms and Conditions on mount
    useEffect(() => {
        const loadTermData = async () => {
            try {
                const termData = await dispatch(termList());
                if (termData) {
                    // Reset form with fetched data
                    reset({ content: termData.content });
                }
            } catch (error) {
                console.error('Failed to load terms and conditions', error);
            }
        };
        loadTermData();
    }, [dispatch, reset]);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await dispatch(createTerm(data));
            if (response) {
                navigate('/settings/terms-conditions');
            }
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setLoading(false);
        }
    });

    return (

        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Term & Conditions"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'List' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Form methods={methods} onSubmit={onSubmit}>
                <Stack spacing={3}>
                    <Card>
                        <Stack spacing={2} sx={{ p: 3 }}>
                            <Typography variant="subtitle2">Term & Conditions</Typography>
                            <Field.Editor name="content" sx={{ maxHeight: 480 }} />
                        </Stack>
                    </Card>

                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <LoadingButton type="submit" variant="contained" loading={false}>
                            Submit
                        </LoadingButton>
                    </Stack>
                </Stack>
            </Form>

        </DashboardContent>
    );
}
