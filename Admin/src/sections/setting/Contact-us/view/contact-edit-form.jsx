
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {Card,Stack, Typography} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { contactList, createContact, createTerm, termList } from 'src/store/action/settingActions';

const ContactUS = zod.object({
    message: zod.string().min(1, 'Message is required!'),
});

export default function ContactEditForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // Initialize form
    const methods = useForm({
        resolver: zodResolver(ContactUS),
        defaultValues: { message: '' },
    });

    const { reset, handleSubmit } = methods;

    // Fetch existing Contacts and Conditions on mount
    useEffect(() => {
        const loadContactData = async () => {
            try {
                const contactData = await dispatch(contactList());
                if (contactData) {
                    // Reset form with fetched data
                    reset({ message: contactData.message });
                }
            } catch (error) {
                console.error('Failed to load terms and conditions', error);
            }
        };
        loadContactData();
    }, [dispatch, reset]);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            await dispatch(createContact(data));
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setLoading(false);
        }
    });

    return (

        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Contact"
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
                            <Typography variant="subtitle2">Contact-Us</Typography>
                            <Field.Editor name="message" sx={{ maxHeight: 480 }} />
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
