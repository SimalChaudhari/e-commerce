import { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { useCheckoutContext } from './context';
import { CheckoutSummary } from './checkout-summary';
import { AddressItem, AddressNewForm } from 'src/sections/vendor-sections/address';
import { useDispatch, useSelector } from 'react-redux';
import useCart from './components/useCart';
import { addressList, createAddress, deleteAddress, updateAddress } from 'src/store/action/addressActions';
import { CheckoutPayment } from './checkout-payment';
import { LoadingButton } from '@mui/lab';
import { Typography, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { createOrder, createOrderItem } from 'src/store/action/orderActions';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useForm } from 'react-hook-form';

const DELIVERY_OPTIONS = [
  { id: 'Transportation', value: 0, label: 'Transportation', description: '3-5 days delivery' },
  { id: 'Self Pickup', value: 0, label: 'Self Pickup', description: '2-3 days delivery' },
]

export function CheckoutBillingAddress() {

  const [discountData, setDiscountData] = useState(0); // State for discount value
  const checkout = useCheckoutContext();
  const dispatch = useDispatch();
  const mappedData = useCart();

  const subtotal = mappedData.reduce((acc, item) => acc + item.totalAmount, 0);
  const quantity = mappedData.reduce((acc, item) => acc + item.quantity, 0);

  const total = (subtotal - discountData) // Apply percentage discount
  const discountPercentage = ((discountData / subtotal) * 100)

  const addressForm = useBoolean();
  const userAddress = useSelector((state) => state.address?.address || []);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null); // State for address being edited
  const [confirmDelete, setConfirmDelete] = useState(null); // State for delete confirmation


  const defaultValues = { delivery: checkout.shipping };
  const methods = useForm({ defaultValues });


  useEffect(() => {
    console.log("hi")
    // Retrieve discount value from sessionStorage on component mount
    const storedDiscount = sessionStorage.getItem('discountValue');
    if (storedDiscount) {
      setDiscountData(storedDiscount);
    } else {
      // If no discount value, initialize with 0
      sessionStorage.setItem('discountValue', 0);
    }
    return () => {
      // Clear discountValue when leaving the billing address page
      sessionStorage.removeItem('discountValue');
    };
  }, []);

  useEffect(() => {
    dispatch(addressList());
  }, [dispatch]);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
  };

  const handleAddAddress = async (data) => {
    try {
      await dispatch(createAddress(data));
      dispatch(addressList());
      addressForm.onFalse();
    } catch (error) {
      console.error('Failed to add address:', error);
    }
  };

  const handleEditAddress = async (id, data) => {
    try {
      await dispatch(updateAddress(id, data));
      dispatch(addressList());
      setAddressToEdit(null); // Clear edit mode after updating
      addressForm.onFalse(); // Close the form
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      if (confirmDelete) {
        await dispatch(deleteAddress(confirmDelete)); // Delete address with ID
        dispatch(addressList());
        setConfirmDelete(null); // Close the confirmation dialog
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const toggleShowAllAddresses = () => {
    setShowAllAddresses((prev) => !prev);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const selectedDeliveryId = methods.getValues('delivery'); // Get selected delivery ID
    const selectedDeliveryOption = DELIVERY_OPTIONS.find(option => option.id === selectedDeliveryId);

    try {
      const orderData = {
        totalPrice: subtotal,
        totalQuantity: quantity,
        addressId: selectedAddressId,
        delivery: selectedDeliveryOption.id,
        discount: discountPercentage,
        finalAmount: total


      };

      const orderResponse = await dispatch(createOrder(orderData));

      if (orderResponse) {
        const itemData = {
          orderId: orderResponse.data?.id,
          products: mappedData.map((item) => ({
            productId: item.productID,
            quantity: item.quantity,
          })),
        };

        const itemResponse = await dispatch(createOrderItem(itemData));

        if (itemResponse) {
          checkout.onNextStep();
          checkout.onReset();
        } else {
          console.error('Failed to create items for the order:', itemResponse);
        }
      } else {
        console.error('Failed to create order:', orderResponse);
      }
    } catch (error) {
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ mb: 1 }}>
            <CheckoutPayment deliveryOptions={DELIVERY_OPTIONS} methods={methods} /> {/* Pass delivery options and form methods */}
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    setAddressToEdit(null); // Clear edit mode
                    addressForm.onTrue(); // Open form for new address
                  }}
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  New Address
                </Button>
              </Stack>

              <Box sx={{ mt: 1 }}>
                {userAddress.length > 0 ? (
                  <div>
                    {(showAllAddresses ? userAddress : userAddress.slice(0, 2)).map((address) => (
                      <Box key={address.id} sx={{ position: 'relative', mb: 3 }}>
                        <AddressItem
                          address={address}
                          onClick={() => handleSelectAddress(address.id)}
                          sx={{
                            p: 3,
                            borderRadius: 1,
                            boxShadow: (theme) => theme.customShadows.card,
                            cursor: 'pointer',
                            border: selectedAddressId === address.id ? '2px solid black' : '1px solid grey',
                            backgroundColor: selectedAddressId === address.id ? '#e3f2fd' : 'transparent', // Light background for selected address

                          }}
                        />
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => {
                              setAddressToEdit(address); // Set address to edit
                              addressForm.onTrue(); // Open form with edit mode
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => setConfirmDelete(address.id)} // Open confirm dialog
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                    {userAddress.length > 2 && (
                      <Button onClick={toggleShowAllAddresses} fullWidth>
                        {showAllAddresses ? 'Show Less' : 'Show More'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Typography>No address available</Typography>
                )}
              </Box>
            </CardContent>
          </Card>

          <Button
            sx={{ m: 1 }}
            size="small"
            color="inherit"
            onClick={checkout.onBackStep}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Back
          </Button>
        </Grid>

        <Grid xs={12} md={4}>
          <CheckoutSummary
            total={total}
            subtotal={subtotal}
            shipping={checkout.shipping}
            discount={discountData}
          />

          {subtotal > 0 && (
            <>
              {!selectedAddressId && !isSubmitting && (
                <Typography variant='body' color="error" sx={{ mb: 1 }}>
                  Please select any address
                </Typography>
              )}

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={!selectedAddressId || isSubmitting}
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Complete order
              </LoadingButton>
            </>
          )}
        </Grid>
      </Grid>

      <AddressNewForm
        open={addressForm.value}
        onClose={() => {
          addressForm.onFalse();
          setAddressToEdit(null); // Clear edit data when form closes
        }}
        onCreate={handleAddAddress}
        onEdit={handleEditAddress}
        editData={addressToEdit} // Pass address data for editing
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete Address?"
        content={
          <Box>
            <Typography gutterBottom>Are you sure you want to delete this Address?</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              This action cannot be undone.
            </Typography>
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAddress}

          >
            Delete
          </Button>
        }
      />


    </>
  );
}
