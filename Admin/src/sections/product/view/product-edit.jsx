
import { paths } from 'src/routes/paths';
import { DashboardContent, PageContentLayout } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import ProductNewEditForm from './product-new-edit-form';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { itemGetByList } from 'src/store/action/productActions';
import { Box } from '@mui/material';

// Dummy product data
// ----------------------------------------------------------------------
export function ProductEditView() {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the product ID from URL
    const product = useSelector((state) => state.product.getByProduct); // Access the product from the Redux store

    useEffect(() => {
        // Fetch the product data when the component mounts
        if (id) {
            dispatch(itemGetByList(id));
        }
    }, [id, dispatch]);

    return (
        <DashboardContent maxWidth='2xl'>
            <CustomBreadcrumbs
                heading={`Edit# ${product?.itemName}`}
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Products', href: paths?.products.root },
                    { name: "Edit"},
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <Box>
                <ProductNewEditForm currentProduct={product} />
            </Box>
        </DashboardContent>
    );
}
