import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { fDate, fTime } from 'src/utils/format-time';
import { Label } from 'src/components/label';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function LogTableRow({ row, selected, onSelectRow ,index}) {

  const navigate = useNavigate(); // Initialize the navigation hook

  const handleNavigation = () => {
    // Define the route mapping
    const routeMapping = {
      Vendors: paths.vendors.root,
      Stocks: paths.stocks.root,
      Invoices: paths.orders.root,
      Products: paths.products.root,
      Receivables: paths.accounts.receivable,
    };
    // Get the corresponding route or a fallback
    const targetPath = routeMapping[row.sync_type] || '/default';

    // Navigate to the target path
    navigate(targetPath);
  };
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': 'Row checkbox' }}
        />
      </TableCell>
 
      {/* Sync Type */}
      <TableCell >
        <Link color="inherit" sx={{ cursor: 'pointer' }} onClick={handleNavigation}>
          {row.sync_type || 'N/A'}
        </Link>
      </TableCell>
      {/* Sync Date */}
      <TableCell>
        <ListItemText
          primary={fDate(row.created_at) || 'N/A'}
          secondary={fTime(row.created_at) || ''}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      {/* Status */}
      <TableCell>
        <Label
          variant="soft"
          color={
            (row.status === 'success' && 'success') ||
            (row.status === 'fail' && 'error') ||
            'default'
          }
        >
          {row.status || 'N/A'}
        </Label>
      </TableCell>
    </TableRow>
  );
}
