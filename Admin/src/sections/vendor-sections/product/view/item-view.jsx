import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { itemGetByList } from 'src/store/action/productActions';
import { ProductDetailsSummary } from '../components/product-details-summary';
import { ProductDetailsCarousel } from '../components/product-details-carousel';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 days replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

export function ItemView() {
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
    <DashboardContent>
      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <ProductDetailsCarousel images={products?.productImages ?? []} />
        </Grid>
        <Grid xs={12} md={6} lg={5}>
          {products && <ProductDetailsSummary disableActions products={products} />}
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </DashboardContent>
  );
}
