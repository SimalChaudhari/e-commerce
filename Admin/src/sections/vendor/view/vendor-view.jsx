import { useEffect } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { vendorGetByList } from 'src/store/action/vendorActions';
import {
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';

export function VendorView() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const vendors = useSelector((state) => state.vendor.getByVendor);

  useEffect(() => {
    if (id) {
      dispatch(vendorGetByList(id));
    }
  }, [id, dispatch]);

  const renderIcon = (iconName, color) => (
    <Iconify icon={iconName} sx={{ fontSize: 20, color, mr: 1 }} />
  );

  return (
    <DashboardContent maxWidth="2xl">
      {/* Breadcrumbs */}
      <CustomBreadcrumbs
        heading="View"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Vendors', href: paths?.vendors?.root },
          { name: 'View' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Stack spacing={4} sx={{ pt: 3, px: 3 }}>
        {/* Vendor Summary */}
        <Grid container spacing={3}>
          {/* Card 1: Basic Information */}
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {[
                    { label: 'SL No', value: vendors.slno, icon: 'mdi:numeric', color: 'primary.main' },
                    { label: 'Name', value: vendors.name, icon: 'mdi:account-circle', color: 'success.main' },
                    { label: 'Alias', value: vendors.alias, icon: 'mdi:label', color: 'info.main' },
                    { label: 'Active', value: vendors.active ? 'Yes' : 'No', icon: 'mdi:check-circle', color: 'warning.main' },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item.label}>
                      <Box display="flex" alignItems="center">
                        
                        <Box>
                        {renderIcon(item.icon, item.color)}
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.value || 'Not Available'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

           {/* Card 3: Tax Details */}
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tax Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {[
                    { label: 'PAN', value: vendors.pan, icon: 'mdi:credit-card', color: 'primary.main' },
                    { label: 'GST Type', value: vendors.gsttype, icon: 'mdi:tag', color: 'success.main' },
                    { label: 'GST No', value: vendors.gstno, icon: 'mdi:barcode', color: 'info.main' },
                    { label: 'GST Details', value: vendors.gstdetails, icon: 'mdi:clipboard-text', color: 'warning.main' },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item.label}>
                      <Box display="flex" alignItems="center">
                        <Box>
                        {renderIcon(item.icon, item.color)}

                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.value || 'Not Available'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          {/* Card 2: Contact Information */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  {[
                    { label: 'Contact Person', value: vendors.contactperson, icon: 'mdi:account', color: 'primary.main' },
                    { label: 'Phone', value: vendors.phone, icon: 'mdi:phone', color: 'success.main' },
                    { label: 'Email', value: vendors.email, icon: 'mdi:email', color: 'info.main' },
                    { label: 'Address', value: vendors.address, icon: 'mdi:home', color: 'warning.main' },
                    { label: 'Pincode', value: vendors.pincode, icon: 'mdi:pin', color: 'error.main' },
                  ].map((item) => (
                    <Grid item xs={12} sm={6} key={item.label}>
                      <Box display="flex" alignItems="center">
                       
                        <Box>
                        {renderIcon(item.icon, item.color)}
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.value || 'Not Available'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Stack>
    </DashboardContent>
  );
}
