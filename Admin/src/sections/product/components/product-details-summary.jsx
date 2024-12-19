import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import { fCurrency, formatDateIndian } from 'src/utils/format-number';
import { Form } from 'src/components/hook-form';
import { itemGetByList } from 'src/store/action/productActions';
import { ProductDetailsCarousel } from './product-details-carousel';
import { Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

export function ProductDetailsSummary({ products, disableActions, ...other }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(itemGetByList(id));
    }
  }, [id, dispatch]);

  return (
    <Form>
      <Stack spacing={4} sx={{ pt: 3, px: 3 }} {...other}>

        {/* Product Image and Basic Info */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <ProductDetailsCarousel images={products?.productImages ?? []} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{products?.itemName}</Typography>
            <Typography variant="h6" color="primary.main">{fCurrency(products?.sellingPrice)}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              {products?.description}
            </Typography>

            {/* Classification Table */}
            <Box mt={5}>
              <Typography variant="subtitle1" gutterBottom>Classification</Typography>
              <Divider sx={{ my: 2 }} />
              <TableContainer component={Paper} elevation={0}>
                <Table size="small" aria-label="classification table">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Group</TableCell>
                      <TableCell>{products?.group || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>SubGroup1</TableCell>
                      <TableCell>{products?.subGroup1 || '-'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>SubGroup2</TableCell>
                      <TableCell>{products?.subGroup2 || '-'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Responsive Grid System */}
        <Grid container spacing={3}>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2"> <strong>Dimensional Files</strong></Typography>
              <Divider sx={{ my: 2 }} />
              {products?.dimensionalFiles?.length > 0 ? (
                <Stack direction="column" spacing={0.5} sx={{ ml: 2, mt: 1 }}>
                  {products.dimensionalFiles.map((file, index) => {
                    const isPdf = file.endsWith('.pdf');
                    return (
                      <Stack direction="row" spacing={1} alignItems="center" key={index}>
                        {isPdf ? (
                          <img
                            src="/pdf-logo/pdf.png"
                            alt="pdf"
                            style={{ width: 60, height: 60, objectFit: 'cover' }}
                          />
                        ) : (
                          <img
                            src={file}
                            alt={`Dimensional File ${index + 1}`}
                            style={{ width: 60, height: 60, objectFit: 'cover' }}
                          />
                        )}
                        <a
                          href={file}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', color: '#1976d2' }}
                        >
                          Download
                        </a>
                      </Stack>
                    );
                  })}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                  No dimensional files available
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Box 1: Additional Information */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Additional Information</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Alias:</strong> <span>{products?.alias || 'No Data Available'}</span>
                </Typography>
                <Typography variant="body2">
                  <strong>Part Number:</strong> <span>{products?.partNo || 'No Data Available'}</span>
                </Typography>
                <Typography variant="body2">
                  <strong>Selling Price Date:</strong> <span>{formatDateIndian(products?.sellingPriceDate) || 'No Data Available'}</span>
                </Typography>
              </Stack>
            </Box>
          </Grid>

          {/* Box 2: Tax & Unit Details */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Tax & Unit Details</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>GST Applicable:</strong> <span>{products?.gstApplicable || 'No Data Available'}</span>
                </Typography>
                <Typography variant="body2">
                  <strong>GST Applicable Date:</strong> <span>{formatDateIndian(products?.gstApplicableDate) || 'No Data Available'}</span>
                </Typography>
                <Typography variant="body2">
                  <strong>GST Rate:</strong> <span>{products?.gstRate || 'No Data Available'}</span>
                </Typography>
                <Typography variant="body2">
                  <strong>Base Unit:</strong> <span>{products?.baseUnit || 'No Data Available'}</span>
                </Typography>
                <Typography variant="body2">
                  <strong>Alternate Unit:</strong> <span>{products?.alternateUnit || 'No Data Available'}</span>
                </Typography>
              </Stack>

            </Box>
          </Grid>

          {/* Box 3: Conversion  */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="subtitle1" gutterBottom>Conversion</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Taxability:</strong> <span>{products?.taxability || 'No Data Available'}</span>
                </Typography>
                <Typography variant="body2">
                  <strong>Conversion:</strong> <span>{products?.conversion || 'No Data Available'}</span>
                </Typography>
                <Typography variant="body2">
                  <strong>Denominator:</strong> <span>{products?.denominator || 'No Data Available'}</span>
                </Typography>
              </Stack>
            </Box>
          </Grid>

        </Grid>

      </Stack>
      <Divider sx={{ my: 2 }} />
    </Form>
  );
}
