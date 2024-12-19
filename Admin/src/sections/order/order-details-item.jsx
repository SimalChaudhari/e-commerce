import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fCurrency } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { DUMMY_IMAGE } from 'src/components/constants';

// ----------------------------------------------------------------------

export function OrderDetailsItems({
  items = [],
  totalAmount,
  discount,
  finalAmount
}) {

  const discountPercentage = (totalAmount * discount) / 100

  const renderTotal = (
    <Stack spacing={2} alignItems="flex-end" sx={{ p: 3, textAlign: 'right', typography: 'body2' }}>
      <Stack direction="row">
        <Box sx={{ color: 'text.secondary',fontWeight: 'bold' }}>Subtotal</Box>
        <Box sx={{ width: 160 }}>{fCurrency(totalAmount) || '-'}</Box>
      </Stack>



      <Stack direction="row">
        <Box sx={{ color: 'text.secondary',fontWeight: 'bold' }}>Discount</Box>
        <Box sx={{ width: 160, ...(discountPercentage && { color: 'error.main' }) }}>
          {discountPercentage ? `- ${fCurrency(discountPercentage)}` : '-'}
        </Box>
      </Stack>

      <Stack direction="row">
        <Box sx={{ color: 'text.secondary',fontWeight: 'bold' }}>Shipping</Box>
        <Box sx={{ width: 160}}>
         Free
        </Box>
      </Stack>

      <Stack direction="row" sx={{ typography: 'subtitle1' }}>
        <div style={{fontWeight: 'bold'}}>Total</div>
        <Box sx={{ width: 160 }}>{fCurrency(finalAmount) || '-'}</Box>
      </Stack>
    </Stack>
  );


  return (
    <Card>
      <CardHeader
        title="Order Info"

      />

      <Scrollbar>
        {items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            alignItems="center"
            sx={{
              p: 3,
              minWidth: 640,
              borderBottom: (theme) => `dashed 2px ${theme.vars.palette.background.neutral}`,
            }}
          >
            <Avatar src={item.product?.productImages?.[0] || DUMMY_IMAGE} variant="rounded" sx={{ width: 48, height: 48, mr: 2 }} />

            <ListItemText
              primary={item.product?.itemName}
              secondary={item.product?.alias}
              primaryTypographyProps={{ typography: 'body2' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
                mt: 0.5,
              }}
            />

            <Box sx={{ typography: 'body2' }}>x{item.quantity}</Box>

            <Box sx={{ width: 110, textAlign: 'right', typography: 'subtitle2' }}>
              {fCurrency(item?.product?.sellingPrice)}
            </Box>
          </Stack>
        ))}
      </Scrollbar>

      {renderTotal}
    </Card>
  );
}
