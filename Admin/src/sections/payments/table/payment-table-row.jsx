import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar } from '@mui/material';
import { useFetchData } from '../components/fetch-payment';
import { DUMMY_IMAGE } from 'src/components/constants';

export function PaymentTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
    const confirm = useBoolean();
    const { fetchData } = useFetchData();
    const popover = usePopover();



    return (
        <>
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
                <TableCell padding="checkbox">
                    <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <Avatar
                            variant="rounded"
                            alt={row?.qrCodeImageUrl || "Product Image"}
                            src={row?.qrCodeImageUrl && row?.qrCodeImageUrl?.length ? row.qrCodeImageUrl : DUMMY_IMAGE}
                            sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                            <Tooltip title="Direct To Edit Page">
                                <Link
                                    component={RouterLink}
                                    to={`/payments/edit/${row.id}`} // Ensure this route exists
                                    sx={{
                                        color: '#1E40AF', // Custom dark blue shade
                                        cursor: 'pointer',
                                        textDecoration: 'none', // No underline by default
                                        fontWeight: 'bold', // Bold text
                                        display: 'inline-block', // Ensures width works with inline elements
                                        width: '200px', // Set the desired width
                                        '&:hover': {
                                            textDecoration: 'underline', // Underline on hover
                                            color: '#0F3D91', // Slightly darker blue shade on hover (optional)
                                        },
                                    }}
                                >
                                    {row.type}
                                </Link>
                            </Tooltip>


                        </Stack>
                    </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.accountName || row.paypalEmail || row.upiId || ' - '}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.accountNumber || '-'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.ifscCode || row.upiProvider || '-'}</TableCell>

                <TableCell>
                    <Stack direction="row" alignItems="center">

                        <Tooltip title="View Actions">
                            <Link
                                component={RouterLink}
                                to='/payments/view' // Ensure this route exists
                                sx={{ textDecoration: 'none' }}
                            >
                                <IconButton>
                                    <Iconify icon="solar:eye-bold" />
                                </IconButton>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Quick Edit" arrow>
                            <Link
                                component={RouterLink}
                                to={`/payments/edit/${row.id}`} // Ensure this route exists
                                sx={{ textDecoration: 'none' }}
                            >
                                <IconButton>
                                    <Iconify icon="solar:pen-bold" />
                                </IconButton>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Delete Actions">
                            <IconButton onClick={() => {
                                confirm.onTrue();
                                popover.onClose();
                            }}>
                                <Iconify icon="solar:trash-bin-trash-bold" />
                            </IconButton>
                        </Tooltip>


                    </Stack>
                </TableCell>
            </TableRow >

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete Payment Method"
                content={`Are you sure you want to delete this payment method (${row.type})?`}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            onDeleteRow(row.id);
                            fetchData();
                            confirm.onFalse();
                        }}
                    >
                        Delete
                    </Button>
                }
            />
        </>
    );
}
