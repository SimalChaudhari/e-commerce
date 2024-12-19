import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import ListItemText from '@mui/material/ListItemText';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { FAQGetByList } from 'src/store/action/settingActions';
import DOMPurify from 'dompurify';
// Format Date (Dummy for UI purposes)
const fDate = (date) => new Date(date).toLocaleDateString();

// Function to apply color based on status
const getStatusColor = (status) => {
    switch (status) {
        case 'Active':
            return 'success.main';
        case 'Inactive':
            return 'warning.main';
        default:
            return 'info.main';
    }
};

export function FAQView() {

    const dispatch = useDispatch();
    const { id } = useParams(); // Get the product ID from URL
    const faq = useSelector((state) => state.setting.getByFAQ); // Access the product from the Redux store

    useEffect(() => {
        // Fetch the FAQ data when the component mounts
        if (id) {
            dispatch(FAQGetByList(id));
        }
    }, [id, dispatch]);

    const renderContent = (
        <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
            {[
                {
                    label: 'Question',
                    value: faq?.question,
                    icon: <Iconify icon="mdi:question-mark-circle" />,
                },
                {
                    label: 'Answer',
                    value: faq.answer ? (
                        <span
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq.answer) }} />
                    ) : 'not available',
                    icon: <Iconify icon="mdi:message-reply-text-outline" />,
                }
                ,
                {
                    label: 'Status',
                    value: faq?.status,
                    icon: <Iconify icon="mdi:alert-circle-outline" />,
                    color: getStatusColor(faq?.status), // Apply status color
                },
            ].map((item) => (
                <Stack key={item.label} spacing={1.5} direction="row" alignItems="flex-start">
                    <span style={{ marginRight: 8 }}> {/* Space between icon and label */}
                        {item.icon}
                    </span>
                    <ListItemText
                        primary={item.label}
                        secondary={item.value}
                        primaryTypographyProps={{ typography: 'body2', color: 'text.secondary', mb: 0.5 }}
                        secondaryTypographyProps={{
                            component: 'span',
                            color: item.color || 'text.primary',
                            typography: 'subtitle2',
                        }}
                    />
                </Stack>
            ))}
        </Card>
    );

    const renderOverview = (
        <Card sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
            {[
                {
                    label: 'Date posted',
                    value: fDate(faq?.created_at),
                    icon: <Iconify icon="mdi:calendar-check-outline" />,
                },
                {
                    label: 'Updated date',
                    value: fDate(faq?.updated_at),
                    icon: <Iconify icon="mdi:calendar-edit-outline" />,
                },
            ].map((item) => (
                <Stack key={item.label} spacing={1.5} direction="row" alignItems="center">
                    {item.icon}
                    <ListItemText
                        primary={item.label}
                        secondary={item.value}
                        primaryTypographyProps={{ typography: 'body2', color: 'text.secondary', mb: 0.5 }}
                        secondaryTypographyProps={{
                            component: 'span',
                            color: 'text.primary',
                            typography: 'subtitle2',
                        }}
                    />
                </Stack>
            ))}
        </Card>
    );

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                     { name: 'FAQ', href: paths?.settings.faq },
                    { name: 'List' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <Grid container spacing={3}>
                    <Grid xs={12} md={8}>
                        {renderContent}
                    </Grid>

                    <Grid xs={12} md={4}>
                        {renderOverview}
                    </Grid>
                </Grid>
            </PageContentLayout>
        </DashboardContent>
    );
}
