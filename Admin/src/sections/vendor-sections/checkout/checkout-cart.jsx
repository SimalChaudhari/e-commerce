import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { CONFIG } from 'src/config-global';
import { EmptyContent } from 'src/components/empty-content';
import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { CheckoutCartProductList } from './checkout-cart-product-list';
import { useDispatch } from 'react-redux';
import { cartList, clearCartItem, deleteCartItem } from 'src/store/action/cartActions';
import useCart from './components/useCart';
import { toast } from 'sonner';
import { fCurrency } from 'src/utils/format-number';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export function CheckoutCart() {
  const dispatch = useDispatch();
  const [discount, setDiscount] = useState(0); // State to store the discount amount
  const [discountType, setDiscountType] = useState('fixed'); // 'fixed' or 'percentage'
  const confirm = useBoolean();
  const mappedData = useCart();

  const [deleting, setDeleting] = useState(false);
  const [itemsToRemove, setItemsToRemove] = useState([]);


  const totalItems = mappedData.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = mappedData.reduce((acc, item) => acc + item.totalAmount, 0);
  // Calculate the total after applying the discount
  const total =
    discountType === 'percentage'
      ? subtotal - (subtotal * discount) / 100 // Apply percentage discount
      : subtotal - discount; // Apply fixed discount
  // const discount = 0;
  //----------------------------------------------------------------------------------------------------
  const checkoutConditions = async () => {
    const itemsWithZeroStock = mappedData.filter(data => data.stockQuantity === 0);

    if (itemsWithZeroStock.length > 0) {
      setItemsToRemove(itemsWithZeroStock); // Store items to be removed
      confirm.onTrue(); // Open the confirmation dialog
    } else {
      checkout.onNextStep(); // Proceed to the next step if no unavailable items
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true); // Set deleting state to true to disable the button
      // Remove each item with stockQuantity 0 from the cart
      await Promise.all(
        itemsToRemove.map(data => dispatch(deleteCartItem(data.id))) // Dispatch the remove action for each item
      );
      confirm.onFalse(); // Close the confirmation dialog after deletion is complete
      setDeleting(false); // Reset deleting state
      fetchData();
    } catch (error) {
      setDeleting(false); // Reset deleting state if an error occurs
    }
  };

  const handleCheckCart = async () => {
    try {
      await checkoutConditions(); // Handle the checkout conditions
    } catch (error) {
      console.error("Failed to clear the cart:", error);
    }
  };




  const fetchData = async () => {
    await dispatch(cartList());
  };

  const checkout = useCheckoutContext();

  const empty = mappedData.length === 0;

  const handleDeleteCart = async (id) => {
    const res = await dispatch(deleteCartItem(id)); // Action to delete an item
    if (res) {
      fetchData();

    }
  };

  const handleDownload = async (id) => {
    const item = mappedData.find((data) => data.id === id);

    if (item && item.dimensionalFiles?.[0]) {
      window.open(item.dimensionalFiles?.[0], '_blank'); // Opens the PDF in a new tab

    } else {
      toast.warning('File Not found for this item', id);
    }
  };

  const handleApplyDiscount = (discountValue, type = 'fixed') => {
    if (subtotal > 0) {
      if (type === 'percentage' && (discountValue < 0 || discountValue > 100)) {
        toast.error('Enter a valid percentage between 0 and 100');
        return;
      }

      setDiscount(discountValue);
      sessionStorage.setItem('discountValue', discountValue);

      setDiscountType(type);
      toast.success(
        type === 'percentage'
          ? `Discount of ${discountValue}% applied!`
          : `Discount of ${fCurrency(discountValue)} applied!`
      );
    } else {
      toast.warning('Cannot apply discount to an empty cart');
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await dispatch(clearCartItem()); // Action to delete an item
      if (res) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to clear the cart:", error);
    }
  };



  return (
    <Grid container spacing={3}>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete products?"
        content={
          <Box>
            <Typography gutterBottom>
              Some of the products in your cart are unavailable. Would you like to remove the unavailable ones and proceed with the available products?
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Note: After removing the unavailable products, you can continue to the next step of the checkout process.
            </Typography>

          </Box>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete} // Handle the deletion on confirmation
            disabled={deleting} // Disable the button while deletion is in progress
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
      <Grid xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6">
                Cart
                <Typography component="span" sx={{ color: 'text.secondary' }}>
                  &nbsp;({totalItems} item{totalItems > 1 ? 's' : ''})
                </Typography>
              </Typography>
            }

            action={
              !empty && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleClearCart} // Add the handler function to clear the cart
                >
                  Clear Cart
                </Button>
              )}
            sx={{ mb: 3 }}

          />

          {empty ? (
            <EmptyContent
              title="Cart is empty!"
              description="Look like you have no items in your shopping cart."
              imgUrl={`${CONFIG.site.basePath}/assets/icons/empty/ic-cart.svg`}
              sx={{ pt: 5, pb: 10 }}
            />
          ) : (
            <CheckoutCartProductList
              products={mappedData}
              onDelete={handleDeleteCart}
              onDownload={handleDownload}
            />
          )}
        </Card>


      </Grid>

      <Grid xs={12} md={4}>
        <CheckoutSummary
          total={total}
          discount={discount}
          subtotal={subtotal}
          onApplyDiscount={handleApplyDiscount}
        />

        <Button
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          disabled={empty}
          onClick={handleCheckCart}
        >
          Check out
        </Button>
      </Grid>
    </Grid>
  );
}
