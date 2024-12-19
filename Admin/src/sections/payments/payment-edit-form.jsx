import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { RadioGroup, FormControlLabel, Radio, Avatar } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import PhoneIcon from '@mui/icons-material/Phone';
import AddIcon from '@mui/icons-material/Add';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { deleteQRPayment, editPayment } from 'src/store/action/paymentActions';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

// Define schemas for different payment methods
const BankFormSchema = zod.object({
    accountName: zod.string().min(1, { message: 'Account Name is required!' }),
   accountNumber: zod
    .string()
    .nonempty({ message: 'Account Number is required!' }) // Required field
    .regex(/^\d+$/, { message: 'Account Number must contain only digits!' }) // Only digits
    .min(8, { message: 'Account Number must be at least 8 digits!' }) // Minimum length
    .max(20, { message: 'Account Number must not exceed 20 digits!' }), // Maximum length

    ifscCode: zod.string().min(1, { message: 'IFSC Code is required!' }),
});

const PayPalFormSchema = zod.object({
    paypalEmail: zod.string().email({ message: 'Valid PayPal email is required!' }),
});

const UPIFormSchema = zod.object({
    upiId: zod.string().min(1, { message: 'UPI ID is required!' }),
    upiProvider: zod.string().min(1, { message: 'UPI Provider is required!' }),
    qrCodeImageUrl: zod.any().optional(),

});

export function PaymentEditForm({ payment }) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(payment?.type || 'Bank'); // Default tab based on payment type

    const paymentID = useParams()
    const defaultValues = {
        accountName: payment?.accountName || '',
        accountNumber: payment?.accountNumber || '',
        ifscCode: payment?.ifscCode || '',
        paypalEmail: payment?.paypalEmail || '',
        upiId: payment?.upiId || '',
        upiProvider: payment?.upiProvider || '',
        qrCodeImageUrl: payment?.qrCodeImageUrl || '',
    };

    const methods = useForm({
        resolver: zodResolver(
            activeTab === 'Bank'
                ? BankFormSchema
                : activeTab === 'Paypal'
                    ? PayPalFormSchema
                    : UPIFormSchema
        ),
        defaultValues,
    });



    useEffect(() => {
        if (payment?.type) {
            setActiveTab(payment.type); // Update activeTab when payment.type is available
        }
    }, [payment?.type]); // Watch for changes in payment.type

    const { handleSubmit, setValue, reset, formState: { isSubmitting, errors } } = methods;

    useEffect(() => {
        reset(defaultValues); // Reset the form with the provided payment data
    }, [payment, reset]);

    const onSubmit = handleSubmit(async (data) => {
        const formData = new FormData();

        // Add data to FormData based on activeTab
        if (activeTab === 'Bank') {
            formData.append('type', 'Bank');
            formData.append('accountName', data.accountName);
            formData.append('accountNumber', data.accountNumber);
            formData.append('ifscCode', data.ifscCode);
            if (data.qrCodeImageUrl) {
                formData.append('qrCodeImageUrl', data.qrCodeImageUrl);
            }
        } else if (activeTab === 'Paypal') {
            formData.append('type', 'Paypal');
            formData.append('paypalEmail', data.paypalEmail);
        } else if (activeTab === 'UPI') {
            formData.append('type', 'UPI');
            formData.append('upiId', data.upiId);
            formData.append('upiProvider', data.upiProvider);
            if (data.qrCodeImageUrl) {
                formData.append('qrCodeImageUrl', data.qrCodeImageUrl);
            }
        }

        setLoading(true);
        try {
            const response = await dispatch(editPayment(payment.id, formData)); // Dispatch the update action
            if (response) {
                navigate('/payments'); // Redirect to payments list
            }
        } catch (error) {
            console.error('Error updating payment:', error);
        } finally {
            setLoading(false);
        }
    });

    const handleRemoveFile = useCallback(() => {
        dispatch(deleteQRPayment(paymentID?.id))
        setValue('qrCodeImageUrl', null);

    }, [setValue]);
    return (
        <Form methods={methods} onSubmit={onSubmit}>
            <Card>
                {/* Tabs for selecting payment method */}
                <Tabs
                    value={activeTab}
                    onChange={(event, newValue) => setActiveTab(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ px: 3 }}
                >
                    <Tab value="Bank" label="Bank Details" />
                    <Tab value="Paypal" label="PayPal" />
                    <Tab value="UPI" label="UPI" />
                </Tabs>

                <Divider />

                <Stack spacing={3} sx={{ p: 3 }}>
                    {/* Render Bank Form */}
                    {activeTab === 'Bank' && (
                        <>
                            <Field.Text name="accountName" label="Account Name" />
                            <Field.Text name="accountNumber" label="Account Number" />
                            <Field.Text name="ifscCode" label="IFSC Code" />
                        </>
                    )}

                    {/* Render PayPal Form */}
                    {activeTab === 'Paypal' && (
                        <Field.Text name="paypalEmail" label="PayPal Email" />
                    )}

                    {/* Render UPI Form */}
                    {activeTab === 'UPI' && (
                        <>
                            <Field.Text name="upiId" label="UPI ID" />
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Select UPI Provider</Typography>
                            <RadioGroup
                                row={false}
                                name="upiProvider"
                                value={methods.watch('upiProvider')} // Watch the `upiProvider` field for changes
                                onChange={(e) => setValue('upiProvider', e.target.value)}
                            >
                                <Stack spacing={2}>
                                    <FormControlLabel
                                        value="Google Pay"
                                        control={<Radio />}
                                        label={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar sx={{ bgcolor: '#4285F4' }}>
                                                    <GoogleIcon />
                                                </Avatar>
                                                <Typography>Google Pay</Typography>
                                            </Stack>
                                        }
                                    />
                                    <FormControlLabel
                                        value="PhonePe"
                                        control={<Radio />}
                                        label={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar sx={{ bgcolor: '#673AB7' }}>
                                                    <PhoneIcon />
                                                </Avatar>
                                                <Typography>PhonePe</Typography>
                                            </Stack>
                                        }
                                    />
                                    <FormControlLabel
                                        value="Other"
                                        control={<Radio />}
                                        label={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar sx={{ bgcolor: '#9E9E9E' }}>
                                                    <AddIcon />
                                                </Avatar>
                                                <Typography>Other</Typography>
                                            </Stack>
                                        }
                                    />
                                </Stack>
                            </RadioGroup>

                            {errors.upiProvider && (
                                <Typography color="error" variant="body2">
                                    {errors.upiProvider.message}
                                </Typography>
                            )}

                            <Stack spacing={1.5}>
                                <Typography variant="subtitle2">QR Code Image (Optional)</Typography>
                                {methods.watch('qrCodeImageUrl') && (
                                    <Box sx={{ width: 100, height: 100, borderRadius: 1, overflow: 'hidden', mb: 1 }}>
                                        <img
                                            src={typeof methods.watch('qrCodeImageUrl') === 'string'
                                                ? methods.watch('qrCodeImageUrl') // Show existing image URL
                                                : URL.createObjectURL(methods.watch('qrCodeImageUrl'))} // Show new uploaded image
                                            alt="QR Code Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>
                                )}
                                <Field.Upload
                                    name="qrCodeImageUrl"
                                    maxSize={3145728}
                                    accept={{
                                        'image/png': [],
                                        'image/jpeg': [], // Covers both .jpeg and .jpg
                                    }}
                                    onDelete={handleRemoveFile}
                                />
                            </Stack>

                        </>
                    )}

                    {/* Submit Button */}
                    <Box>
                        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting || loading}>
                            Update Payment
                        </LoadingButton>
                    </Box>
                </Stack>
            </Card>
        </Form>
    );
}
