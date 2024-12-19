
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import FAQCreateForm from '../form/faqs-new-create-form';

// Dummy product data
// ----------------------------------------------------------------------
export function FAQCreateView() {

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Create"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'FAQ', href: paths?.settings.faq },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <FAQCreateForm />
            </PageContentLayout>
        </DashboardContent>
    );
}
