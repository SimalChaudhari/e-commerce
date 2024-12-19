
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FAQGetByList } from 'src/store/action/settingActions';
import FAQNewEditForm from '../form/faqs-new-edit-form';

// Dummy product data
// ----------------------------------------------------------------------
export function FAQEditView() {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the product ID from URL
    const faq = useSelector((state) => state.setting.getByFAQ); // Access the product from the Redux store

    useEffect(() => {
        // Fetch the product data when the component mounts
        if (id) {
            dispatch(FAQGetByList(id));
        }
    }, [id, dispatch]);

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Edit"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'FAQ', href: paths?.settings.faq },
                    { name: 'Edit' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <FAQNewEditForm currentFAQ={faq} />
            </PageContentLayout>
        </DashboardContent>
    );
}
