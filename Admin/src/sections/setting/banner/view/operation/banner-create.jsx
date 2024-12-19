
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import  { BannerCreateForm } from '../form/banner-create-form';

// Dummy product data
// ----------------------------------------------------------------------
export function BannerCreateView() {

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Create"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Banner', href: paths?.settings?.banner },
                    { name: 'Create' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <PageContentLayout>
                <BannerCreateForm/>
            </PageContentLayout>
        </DashboardContent>
    );
}
