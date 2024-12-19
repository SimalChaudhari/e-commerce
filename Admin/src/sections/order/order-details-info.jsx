import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { LetterAvatar } from 'src/components/avatar';

// ----------------------------------------------------------------------

export function OrderDetailsInfo({ delivery, customer, shippingAddress }) {
  const renderCustomer = (
    <>
      <CardHeader
        title="Customer info"

      />
      <Stack direction="row" sx={{ p: 3 }}>
        <LetterAvatar name={customer?.name} size={60} />

        <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2', ml: 1, pt: 1 }}>
          <Typography variant="subtitle2">{customer?.name}</Typography>
          <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>
        </Stack>
      </Stack>
    </>
  );

  const renderDelivery = (
    <>
      <CardHeader
        title="Delivery Info"
      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row" alignItems="center">
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', width: 120, flexShrink: 0 }}>
            Delivery
          </Box>
          {delivery?.delivery}
        </Stack>

      </Stack>
    </>
  );



  const renderShipping = (
    <>
      <CardHeader
        title="Shipping Info"

      />
      <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', width: 120, flexShrink: 0 }}>
            Address
          </Box>
          <Box component="span">{shippingAddress?.street_address}</Box>
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', width: 120, flexShrink: 0 }}>
            State
          </Box>
          <Box component="span">{shippingAddress?.state}</Box>
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', width: 120, flexShrink: 0 }}>
            Zip Code
          </Box>
          <Box component="span">{shippingAddress?.zip_code}</Box>
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', width: 120, flexShrink: 0 }}>
            Country
          </Box>
          <Box component="span">{shippingAddress?.country}</Box>
        </Stack>

        <Stack direction="row">
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'bold', width: 120, flexShrink: 0 }}>
            Mobile
          </Box>
          <Box component="span">{shippingAddress?.mobile}</Box>
        </Stack>
      </Stack>

    </>
  );



  return (
    <Card>
      {renderCustomer}
      <Divider sx={{ borderStyle: 'dashed' }} />

      {renderDelivery}

      <Divider sx={{ borderStyle: 'dashed' }} />


      <Divider sx={{ borderStyle: 'dashed' }} />
      {renderShipping}

    </Card>
  );
}
