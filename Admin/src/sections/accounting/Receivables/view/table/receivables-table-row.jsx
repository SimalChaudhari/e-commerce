import React from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { Iconify } from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export function ReceivablesTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell>
      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
            <Link color="inherit" sx={{ cursor: 'pointer' }}>
              {row?.customerName}
            </Link>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell>{fCurrency(row?.creditLimit)}</TableCell>
      <TableCell>{fCurrency(row?.closingBalance)}</TableCell>
      <TableCell sx={{ px: 1, whiteSpace: 'nowrap' }}>
      <MenuList>
        <MenuItem
          component={RouterLink}
          to={`/accounts/view/${row.id}`}
          sx={{
           
            color: 'green',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              backgroundColor: 'transparent', // Removes background color on hover
              cursor: 'pointer', // Optional: prevent the pointer cursor on hover
            },
          }}
        >
          <Iconify icon="solar:eye-bold" />
        
        </MenuItem>
      </MenuList>
    </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}
