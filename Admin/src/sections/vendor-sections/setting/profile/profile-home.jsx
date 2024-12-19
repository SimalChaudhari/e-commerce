import { useRef } from 'react';

import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';
import { varAlpha } from 'src/theme/styles';

import { Iconify, SocialIcon } from 'src/components/iconify';

import { ProfilePostItem } from './profile-post-item';

// ----------------------------------------------------------------------

export function ProfileHome({ info }) {

  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {/* Country */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {`Country: `}
            <Link variant="subtitle2" color="inherit">
              {info.country || 'N/A'}
            </Link>
          </Box>
        </Stack>

        {/* Address */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="mdi:home-map-marker" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {`Address: `}
            <Link variant="subtitle2" color="inherit">
              {info.address || 'N/A'}
            </Link>
          </Box>
        </Stack>

        {/* State */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-map" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {`State: `}
            <Link variant="subtitle2" color="inherit">
              {info.state || 'N/A'}
            </Link>
          </Box>
        </Stack>

        {/* PinCode */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-pin" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {`Pin Code: `}
            <Link variant="subtitle2" color="inherit">
              {info.pincode || 'N/A'}
            </Link>
          </Box>
        </Stack>

        {/* Mobile No */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:baseline-phone" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {`Mobile No: `}
            <Link variant="subtitle2" color="inherit">
              {info.mobile || 'N/A'}
            </Link>
          </Box>
        </Stack>

        {/* Email */}
        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-email" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {`Email: `}
            <Link variant="subtitle2" color="inherit" href={`mailto:${info.email}`}>
              {info.email || 'N/A'}
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );





  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Stack spacing={3}>
          {renderAbout}
        </Stack>
      </Grid>
    </Grid>
  );
}
