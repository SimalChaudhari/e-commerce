import React, { useEffect, useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Card,
    Stack,
    Divider,
    Grid,
    Avatar,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import PhoneIcon from '@mui/icons-material/Phone';
import AddIcon from '@mui/icons-material/Add';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useFetchData } from './components/fetch-payment';
import { useSelector } from 'react-redux';

export function PaymentViewUi() {
    const [activeTab, setActiveTab] = useState('Bank'); // Default to Bank tab
    const payments = useSelector((state) => state.payment?.payment || []);
    const { fetchData } = useFetchData();

    useEffect(() => {
        fetchData(); // Fetch banners when the component mounts
    }, []);

    // Filter the data based on the active tab
    const filteredPayments = payments.filter((payment) => payment.type === activeTab);

    return (
        <DashboardContent maxWidth="xl">
            <CustomBreadcrumbs
                heading="Payment Details"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Payments', href: paths?.dashboard?.payment?.root },
                    { name: 'Payment Details' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Card>
                {/* Tabs for payment types */}
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

                <Stack spacing={4} sx={{ p: 3 }}>
                    {filteredPayments.length > 0 ? (
                        <Grid container spacing={3}>
                            {filteredPayments.map((payment, index) => (
                                <Grid
                                    item
                                    xs={12}
                                    md={activeTab === 'UPI' ? 4 : 12} // For UPI, divide into grid of 4, otherwise full width
                                    key={payment.id || index}
                                >
                                    <Card sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                                        <Stack spacing={3}>
                                            {/* Render Bank Details */}
                                            {activeTab === 'Bank' && (
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Box
                                                        component="img"
                                                        src="https://png.pngtree.com/png-vector/20190215/ourmid/pngtree-vector-bank-icon-png-image_532993.jpg"
                                                        alt="Bank Image"
                                                        sx={{
                                                            width: '10%',
                                                            height: 'auto',
                                                            borderRadius: 2,
                                                        }}
                                                    />
                                                    <Stack spacing={2} sx={{ width: '100%' }}>
                                                        <Typography
                                                            variant="body"
                                                            sx={{
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'normal',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            <strong>Holder Name:</strong> {payment.accountName || 'N/A'}
                                                        </Typography>
                                                        <Typography
                                                            variant="body"
                                                            sx={{
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'normal',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            <strong>Account Number:</strong> {payment.accountNumber || 'N/A'}
                                                        </Typography>
                                                        <Typography
                                                            variant="body"
                                                            sx={{
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'normal',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            <strong>IFSC Code:</strong> {payment.ifscCode || 'N/A'}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            )}

                                            {/* Render PayPal Details */}
                                            {activeTab === 'Paypal' && index === 0 && (
                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                    <Box
                                                        component="img"
                                                        src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png"
                                                        alt="PayPal Image"
                                                        sx={{
                                                            width: '20%',
                                                            height: 'auto',
                                                            borderRadius: 2,
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body"
                                                        sx={{
                                                            wordBreak: 'break-word',
                                                            whiteSpace: 'normal',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <strong>PayPal ID:</strong> {payment.paypalEmail || 'N/A'}
                                                    </Typography>
                                                </Stack>
                                            )}

                                            {/* Render UPI Details */}
                                            {activeTab === 'UPI' && (
                                                <>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar
                                                            sx={{
                                                                width: 80,
                                                                height: 80,
                                                                bgcolor:
                                                                    payment.upiProvider === 'Google Pay'
                                                                        ? '#4285F4'
                                                                        : payment.upiProvider === 'PhonePe'
                                                                            ? '#673AB7'
                                                                            : '#9E9E9E',
                                                            }}
                                                        >
                                                            {payment.upiProvider === 'Google Pay' && <GoogleIcon />}
                                                            {payment.upiProvider === 'PhonePe' && <PhoneIcon />}
                                                            {payment.upiProvider === 'Other' && <AddIcon />}
                                                        </Avatar>
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                wordBreak: 'break-word',
                                                                whiteSpace: 'normal',
                                                                overflow: 'hidden',
                                                            }}
                                                        >
                                                            {payment.upiProvider || 'No Data'}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            wordBreak: 'break-word',
                                                            whiteSpace: 'normal',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <strong>UPI ID:</strong> {payment.upiId || 'N/A'}
                                                    </Typography>
                                                    {payment.qrCodeImageUrl && (
                                                        <Box
                                                            component="img"
                                                            src={payment.qrCodeImageUrl}
                                                            alt="QR Code"
                                                            sx={{ width: 150, height: 150, mt: 2 }}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </Stack>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant="body2" color="text.secondary" align="center">
                            No {activeTab} payment details available.
                        </Typography>
                    )}
                </Stack>
            </Card>
        </DashboardContent>
    );
}
