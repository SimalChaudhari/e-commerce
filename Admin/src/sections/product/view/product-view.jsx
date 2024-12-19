import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { ProductDetailsSummary } from '../components/product-details-summary';
import { ProductDetailsCarousel } from '../components/product-details-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { itemGetByList } from 'src/store/action/productActions';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export function ProductView() {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the product ID from URL
  const products = useSelector((state) => state.product.getByProduct); // Access the product from the Redux store

  useEffect(() => {
    // Fetch the product data when the component mounts
    if (id) {
      dispatch(itemGetByList(id));
    }
  }, [id, dispatch]);


  return (
    <DashboardContent maxWidth='2xl'>
      <CustomBreadcrumbs
        heading="View"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Products', href: paths?.products.root },
          { name: 'View' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
     <Grid item xs={12} md={12} lg={12}>
          <Box>
            {products && <ProductDetailsSummary disableActions products={products} />}
          </Box>
        </Grid>
  
    </DashboardContent>
  );
}
