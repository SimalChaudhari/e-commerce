import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { useState } from 'react';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export function CheckoutSummary({ total, onEdit, discount, subtotal, shipping, onApplyDiscount }) {
  const [discountCode, setDiscountCode] = useState(''); // State to store input value

  const displayShipping = shipping !== null ? 'Free' : '-';

  const handleInputChange = (event) => {
    setDiscountCode(event.target.value); // Update the state as the user types
  };

  const handleApply = () => {
    const percentage = parseFloat(discountCode);
    if (Number.isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast.error('Enter a valid percentage between 1 and 100');
      return;
    }
  
    const discountValue = (subtotal * percentage) / 100; // Calculate discount as percentage
    onApplyDiscount(discountValue); // Trigger parent function
    setDiscountCode(''); // Clear the input field
  };


  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title="Order summary"
        action={
          onEdit && (
            <Button size="small" onClick={onEdit} startIcon={<Iconify icon="solar:pen-bold" />}>
              Edit
            </Button>
          )
        }
      />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            Sub total
          </Typography>
          <Typography component="span" variant="subtitle2">
            {fCurrency(subtotal)}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            Discount
          </Typography>
          <Typography component="span" variant="subtitle2">
            {discount ? fCurrency(-discount) : '-'}
          </Typography>
        </Box>

        <Box display="flex">
          <Typography
            component="span"
            variant="body2"
            sx={{ flexGrow: 1, color: 'text.secondary' }}
          >
            Shipping
          </Typography>
          <Typography component="span" variant="subtitle2">
            {shipping ? fCurrency(shipping) : displayShipping}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box display="flex">
          <Typography component="span" variant="subtitle1" sx={{ flexGrow: 1 }}>
            Total
          </Typography>

          <Box sx={{ textAlign: 'right' }}>
            <Typography
              component="span"
              variant="subtitle1"
              sx={{ display: 'block', color: 'error.main' }}
            >
              {fCurrency(total)}
            </Typography>
           
          </Box>
        </Box>

        {onApplyDiscount && (
          <TextField
            fullWidth
            placeholder="Enter discount percentage (e.g., 10 for 10%)"
            value={discountCode} // Bind input to state
            onChange={handleInputChange} // Update state on input change
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button color="primary" onClick={handleApply} sx={{ mr: -0.5 }}>
                    Apply
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        )}
      </Stack>
    </Card>
  );
}
