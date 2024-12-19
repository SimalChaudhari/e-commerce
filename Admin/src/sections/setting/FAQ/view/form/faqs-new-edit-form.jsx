import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
    Card, CardHeader, Divider, Stack, Box, Typography, InputAdornment, Switch,
    FormControlLabel, Grid,
    MenuItem
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Field, Form } from 'src/components/hook-form';
import { FAQ_STATUS_OPTIONS } from 'src/_mock';
// import { editFAQ } from 'src/store/action/settingActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { editFAQ } from 'src/store/action/settingActions';


const FAQSchema = zod.object({
    question: zod.string().min(1, 'Question is required!'),
    answer: zod.string().min(1, 'Answer is required!'),
    status: zod.string().min(1, 'Status is required!')

});

export default function FAQNewEditForm({ currentFAQ }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);

    const defaultValues = useMemo(() => ({
        question: currentFAQ?.question || '',
        answer: currentFAQ?.answer || '',
        status: currentFAQ?.status || '',
    }), [currentFAQ]);

    const methods = useForm({
        resolver: zodResolver(FAQSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setValue, watch } = methods;
    const values = watch();

    useEffect(() => {
        if (currentFAQ) {
            reset(defaultValues);
        }
    }, [currentFAQ, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await dispatch(editFAQ(currentFAQ.id, data));
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

                <Card>
                    <CardHeader title="FAQ Details" sx={{ py: 2 }} />
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

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <LoadingButton type="submit" variant="contained" loading={false}>
                        Submit
                    </LoadingButton>
                </Stack>
            </Stack>
        </Form>
    );
}
