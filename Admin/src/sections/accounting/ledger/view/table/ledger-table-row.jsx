import React from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import { useBoolean } from 'src/hooks/use-boolean';
import { fDate, fTime } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { RouterLink } from 'src/routes/components';
// ----------------------------------------------------------------------

export function LedgerTableRow({ row, selected, onSelectRow, onDeleteRow }) {

  const confirm = useBoolean();
  const popover = usePopover();


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
              {row?.party || "-"}
            </Link>
          </Stack>
        </Stack>
      </TableCell>
      <TableCell align="center"> {row?.alias || "-"}</TableCell>
      <TableCell align="center"> {row?.openingBalance || "-"}</TableCell>
      <TableCell align="center"> {row.closingBalance || "-"} </TableCell>
      <TableCell align="center"> {row?.totalDebitAmount || "-"} </TableCell>
      <TableCell align="center"> {row.totalCreditAmount || "-"} </TableCell>

      <TableCell sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <MenuList>
          <MenuItem
            component={RouterLink}
            to={`/accounts/ledger/view/${row.id}`}
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


  return (
    <>
      {renderPrimary}

    </>
  );
}
