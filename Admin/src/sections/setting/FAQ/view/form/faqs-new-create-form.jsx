import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Card, CardHeader, Divider, Stack, MenuItem,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { FAQ_STATUS_OPTIONS } from 'src/_mock';
import { useDispatch } from 'react-redux';
import { createFAQ } from 'src/store/action/settingActions';
import { useNavigate } from 'react-router';

// Zod schema for validation
const FAQSchema = zod.object({
    question: zod.string().min(1, 'Question is required!'),
    answer: zod.string().min(1, 'Answer is required!'),
    status: zod.string().min(1, 'Status is required!')
});

export default function FAQCreateForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // State for loading button
    const [loading, setLoading] = useState(false);

    // Initialize form with useForm hook
    const methods = useForm({
        resolver: zodResolver(FAQSchema),
        defaultValues: {
            question: '',
            answer: '',
            status: '',
        },
    });

    const { handleSubmit, watch } = methods;
    const values = watch();



    // Submit handler
    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await dispatch(createFAQ(data));
            if (response) {
                navigate('/settings/faq')
            }
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setLoading(false);
        }
    });

    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Stack spacing={3}>
                {/* FAQ Details Card */}
                <Card>
                    <CardHeader title="Create New FAQ" sx={{ py: 2 }} />
                    <Divider />
                    <Stack spacing={2} sx={{ p: 3 }}>
                        {/* Question Field */}
                        <Typography variant="subtiQuestiontle2">Question</Typography>
                        <Field.Text name="question" label="Question" />
                        {/* Answer Field */}
                        <Typography variant="subtitle2">Answer</Typography>
                        <Field.Editor name="answer" sx={{ maxHeight: 480 }} />
                        {/* Status Select Field */}
                        <Typography variant="subtitle2">Status</Typography>
                        <Field.Select name="status" label="Status">

                            {FAQ_STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status.value} value={status.value}>
                                    {status.label}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    </Stack>
                </Card>

                {/* Submit Button */}
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <LoadingButton type="submit" variant="contained" loading={loading}>
                        Add FAQ
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
