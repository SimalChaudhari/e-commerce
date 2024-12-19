
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { PaymentCreateForm } from './payment-cretate-form';
import { PaymentEditForm } from './payment-edit-form';
import { paymentGetByList } from 'src/store/action/paymentActions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useEffect } from 'react';

// Dummy product data
// ----------------------------------------------------------------------
export function PaymentEditView() {
    const dispatch = useDispatch();

    const { id } = useParams(); // Get the product ID from URL
    const payment = useSelector((state) => state.payment.getByPayment); // Access the product from the Redux store

    useEffect(() => {
        // Fetch the product data when the component mounts
        if (id) {
             dispatch(paymentGetByList(id));
        }
    }, [id, dispatch]);

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Create"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Payments', href: paths?.payments?.root },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <PaymentEditForm payment={payment} />
            </PageContentLayout>
        </DashboardContent>
    );
}
