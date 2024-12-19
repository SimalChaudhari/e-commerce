
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BannerEditForm } from '../form/banner-edit-form';
import { bannerGetByList } from 'src/store/action/settingActions';


// Dummy product data
// ----------------------------------------------------------------------
export function BannerEditView() {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the product ID from URL
    const banner = useSelector((state) => state.setting.getByBanner); // Access the product from the Redux store

    useEffect(() => {
        // Fetch the product data when the component mounts
        if (id) {
            dispatch(bannerGetByList(id));
        }
    }, [id, dispatch]);

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Edit"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Banner', href: paths?.settings?.banner },
                    { name: 'Edit' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <BannerEditForm currentBanner={banner} />
            </PageContentLayout>
        </DashboardContent>
    );
}
