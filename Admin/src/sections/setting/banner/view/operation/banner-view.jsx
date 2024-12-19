import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { bannerGetByList } from 'src/store/action/settingActions';
import { BannerDetailsCarousel } from '../banner-details-carousel';
import { fDate, fTime } from 'src/utils/format-time';

export function BannerView() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const banner = useSelector((state) => state.setting.getByBanner);

    useEffect(() => {
        if (id) {
            dispatch(bannerGetByList(id));
        }
    }, [id, dispatch]);

    if (!banner) {
        return <Typography variant="h6">Loading banner details...</Typography>;
    }

    return (
        <DashboardContent maxWidth="2xl">
            <CustomBreadcrumbs
                heading="Banner Details"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Banner', href: paths?.settings?.banner },
                    { name: 'Details' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <Box
                    sx={{
                        width: 1,
                        borderRadius: 2,
                        position: 'relative',
                        bgcolor: 'background.neutral',
                    }}
                >
                    <Box sx={{ px: 2, pb: 1, gap: 2, pt: 2.5, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" component="div">
                                {banner.name || 'No name available'}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                rowGap: 1.5,
                                columnGap: 2,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                typography: 'caption',
                                color: 'text.secondary',
                            }}
                        >
                            <Box sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
                                <Iconify width={16} icon="solar:calendar-date-bold" sx={{ flexShrink: 0 }} />
                                {banner.updatedAt ? `${fDate(banner.updatedAt)} ${fTime(banner.updatedAt)}` : 'No duration available'}
                            </Box>

                        </Box>
                    </Box>

                    {banner?.BannerImages?.[0] && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 3,
                            }}
                        >
                            <BannerDetailsCarousel image={banner.BannerImages?.[0]} />
                        </Box>
                    )}
                </Box>
            </PageContentLayout>
        </DashboardContent>
    );
}
