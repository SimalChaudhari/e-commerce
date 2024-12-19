
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Box } from '@mui/material';
import ProductCreateForm from './product-create-form';

// Dummy product data
// ----------------------------------------------------------------------
export function ProductCreateView() {

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading="Create"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Products', href: paths?.products.root },
                    { name: "Create"},
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Box>
                <ProductCreateForm/>
            </Box>
        </DashboardContent>
    );
}
