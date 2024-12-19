import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { vendorGetByList } from 'src/store/action/vendorActions';
import VendorNewEditForm from './vendor-new-edit-form';

export function VendorEditView() {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the product ID from URL
    const vendor = useSelector((state) => state.vendor.getByVendor); 

    useEffect(() => {
        // Fetch the product data when the component mounts
        if (id) {
            dispatch(vendorGetByList(id));
        }
    }, [id, dispatch]);

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Vendors', href: paths?.vendors?.root },
                    { name: 'Edit' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <VendorNewEditForm currentVendor={vendor} />
            </PageContentLayout>
        </DashboardContent>
    );
}
