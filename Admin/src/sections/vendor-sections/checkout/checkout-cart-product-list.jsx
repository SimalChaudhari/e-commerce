import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { CheckoutCartProduct } from './checkout-cart-product';
import { useBoolean } from 'src/hooks/use-boolean';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';

const TABLE_HEAD = [
  { id: 'product', label: 'Product', align: 'center' },
  { id: 'price', label: 'Price' },
  { id: 'quantity', label: 'Quantity', align: 'center' },
  { id: 'available', label: 'Available', align: 'center' },
  { id: 'totalAmount', label: 'Total Price', align: 'center' },
  { id: 'dimensional', label: 'Dimensional', align: 'center' },
  { id: '' },
];

export function CheckoutCartProductList({
  products,
  onDownload,
  onDelete,
}) {
  const confirm = useBoolean();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = () => {
    setDeleting(true);
    onDelete(selectedProductId);
    setDeleting(false);
    confirm.onFalse();
  };

  const openConfirmDialog = (productId) => {
    setSelectedProductId(productId);
    confirm.onTrue();
  };

  return (
    <Scrollbar>
      <Table sx={{ minWidth: 720 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />
        <TableBody>
          {products.map((row) => (
            <CheckoutCartProduct
              key={row.id}
              productID={row.productID}
              row={row}
              onDownload={() => onDownload(row.id)}
              onDelete={() => openConfirmDialog(row.id)} // Open confirm dialog for specific product
            />
          ))}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Product?"
        content={
          <Box>
            <Typography gutterBottom>Are you sure you want to delete this product?</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              This action cannot be undone.
            </Typography>
          </Box>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </Scrollbar>
  );
}
