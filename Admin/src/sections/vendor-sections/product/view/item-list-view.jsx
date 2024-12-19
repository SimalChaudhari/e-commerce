
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { _mock } from 'src/_mock';
import { useFetchProductData } from '../components/fetch-product';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Iconify } from 'src/components/iconify';
import { Badge, Button } from '@mui/material';
import { ItemCardList } from './item-card-list';
import { useRouter } from 'src/routes/hooks';
import { useNavigate } from 'react-router';
import useCart from '../../checkout/components/useCart';
import { CheckoutListView } from '../../checkout/view/checkout-list';

// ----------------------------------------------------------------------

export function ItemListView() {

  const { fetchData } = useFetchProductData(); // Destructure fetchData from the custom hook
  const router = useRouter(); // Initialize the router
  const mappedData = useCart();

  //----------------------------------------------------------------------------------------------------
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);


  // Define the handler for navigating to the checkout page
  const handleCartListClick = () => {
    router.push(paths.items.checkout); // Use router.push() to navigate to the checkout page
    // navigate('/items/checkout/list'); // Adjust the path as per your routing structure
  };

  return (
    <DashboardContent maxWidth="2xl">
      <CustomBreadcrumbs
        heading="List Of Products"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Products', href: paths?.dashboard?.product?.root },
          { name: 'List' },
        ]}

        action={
          <Badge
            badgeContent={mappedData.length} // Display the number of items in the cart
            // badgeContent={6} // Display the number of items in the cart

            color="error"
            overlap="rectangular"
          >
            <Button
              size="large"
              color="success"
              variant="contained"
              startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
              sx={{
                px: 4,
                whiteSpace: 'nowrap',
                width: '100%' // Ensure full width on all screens
              }}
              onClick={handleCartListClick} // Add the click handler here
            >
              Cart List
            </Button>
          </Badge>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <CheckoutListView />
    </DashboardContent>
  );
}
