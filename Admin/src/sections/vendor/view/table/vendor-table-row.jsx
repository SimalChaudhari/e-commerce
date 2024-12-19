import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
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
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom
import { useFetchVendorData } from '../../components';
import { Label } from 'src/components/label';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { onUpdateStatus } from 'src/store/action/vendorActions';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { LetterAvatar } from 'src/components/avatar';

export function VendorTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {


    const confirm = useBoolean();
    const { fetchData } = useFetchVendorData();

    const popover = usePopover();
    const dispatch = useDispatch();

    const [newStatus, setNewStatus] = useState(null); // Temporary status for confirmation
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const confirmStatusChange = async () => {
        try {
            const res = await dispatch(onUpdateStatus(row.id, { status: newStatus })); // Use newStatus here
            if (res) {
                fetchData(); // Refresh data after a successful update
            }

        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsConfirmOpen(false); // Close the confirmation dialog
        }
    };


    // Cancel Status Change
    const cancelStatusChange = () => {
        setNewStatus(null);
        setIsConfirmOpen(false); // Close confirmation dialog
    };

    return (
        <>
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
                <TableCell padding="checkbox">
                    <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell>
                    <Stack spacing={2} direction="row" alignItems="center">
                    <LetterAvatar name={row.name} size={50} />
                        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>

                            <Tooltip title="Direct To View Page">
                                <Link
                                    component={RouterLink}
                                    to={`/vendors/view/${row.id}`}
                                    sx={{
                                        color: '#1E40AF', // Custom dark blue shade
                                        cursor: 'pointer',
                                        textDecoration: 'none', // No underline by default
                                        '&:hover': {
                                            textDecoration: 'underline', // Underline on hover
                                            color: '#0F3D91', // Slightly darker blue shade on hover (optional)
                                        },
                                    }}
                                >
                                    {row.name}
                                </Link>
                            </Tooltip>

                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                {row.email}
                            </Box>
                        </Stack>
                    </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.alias || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.mobile || 'not available'}</TableCell>
                <TableCell sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px'
                }}>{row.address || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.country || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.state || 'not available'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Click here to Change Status">
                        <Label sx={{ cursor: "pointer" }}
                            variant="soft"
                            color={
                                (row.status === 'Active' && 'success') ||
                                (row.status === 'Inactive' && 'error') ||
                                'default'
                            }
                            onClick={() => {
                                // Toggle between Active and Inactive for demonstration
                                const updatedStatus = row.status === 'Active' ? 'Inactive' : 'Active';
                                setNewStatus(updatedStatus); // Set the new status
                                setIsConfirmOpen(true); // Open the confirmation dialog
                            }}
                        >
                            {row.status}
                        </Label>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Stack direction="row" alignItems="center">
                        {/* 
                          <Tooltip title="Quick Edit" placement="top" arrow>
                            <Link
                                component={RouterLink}
                                to={`/vendors/edit/${row.id}`} // Ensure this route exists
                                sx={{ textDecoration: 'none' }}
                            >
                                <IconButton
                                    color={popover.open ? 'inherit' : 'default'}
                                    onClick={(e) => {
                                        // Prevent the default action of the link if popover should open
                                        if (popover.open) {
                                            e.preventDefault();
                                        } else {
                                            popover.onOpen(); // Ensure popover opens correctly
                                        }
                                    }}
                                >
                                    <Iconify icon="solar:pen-bold" />
                                </IconButton>
                            </Link>
                        </Tooltip>
*/}
                        <Tooltip title="More Actions">
                            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                                <Iconify icon="eva:more-vertical-fill" />
                            </IconButton>
                        </Tooltip>

                    </Stack>
                </TableCell>
            </TableRow >

            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            confirm.onTrue();
                            popover.onClose();
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                    <MenuItem
                        component={RouterLink} // Set the component to Link
                        to={`/vendors/view/${row.id}`} // Set the destination URL
                        sx={{ color: 'green' }} // Keep your existing styling
                    >
                        <Iconify icon="solar:eye-bold" />
                        View
                    </MenuItem>

                </MenuList>
            </CustomPopover>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure you want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={() => {
                        onDeleteRow();
                        fetchData();
                        confirm.onFalse();
                    }}>
                        Delete
                    </Button>
                }
            />

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmOpen} onClose={cancelStatusChange}>
                <DialogTitle>Confirm Status Change</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {newStatus === 'Inactive' ? (
                            <>
                                <Typography variant="body">
                                    Are you sure you want to change the status to <strong>{newStatus}</strong>?
                                </Typography>

                                <br />
                                <br />
                                <Typography variant="caption" component="span">
                                    <strong>Note:</strong> The vendor will <strong>not be able to log in</strong> or <strong>place orders</strong>.
                                </Typography>
                            </>
                        ) : (
                            <>
                                <Typography variant="">
                                    Are you sure you want to change the status to <strong>{newStatus}</strong>?
                                </Typography>
                                <br />
                                <br />
                                <Typography variant="caption" component="span">
                                    <strong>Note:</strong> The vendor will be able to <strong>log in</strong> and <strong>place orders</strong>.
                                </Typography>
                            </>
                        )}
                    </DialogContentText>

                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" color="inherit" onClick={cancelStatusChange}>
                        Cancel
                    </Button>
                    <Button onClick={confirmStatusChange} variant="contained" color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    );
}
