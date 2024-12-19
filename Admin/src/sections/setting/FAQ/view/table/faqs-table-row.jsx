
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
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { Link as RouterLink } from 'react-router-dom'; // Import Link from react-router-dom
import { useFetchFAQData } from '../../components/fetch-FAQ';
import { useState } from 'react';


export function FAQTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
    const confirm = useBoolean();
    const { fetchFAQData } = useFetchFAQData();

    const popover = usePopover();

    // State for managing the popover
    const [anchorEl, setAnchorEl] = useState(null);

    // Handle opening and closing of the popover
    const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);

    // Strip HTML tags from the answer for display
    const strippedAnswer = row.answer ? row.answer.replace(/<\/?[^>]+(>|$)/g, "") : 'not available';

    return (
        <>
            <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
                <TableCell padding="checkbox">
                    <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
                </TableCell>

                <TableCell sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '140px', // Set a width that fits your layout
                }}>
                    {row.question || 'not available'}
                </TableCell>

                {/* Answer Cell with ellipsis for overflow */}
                <TableCell
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '200px',
                        cursor: 'pointer', // Indicate that it's clickable
                    }}
                    title={strippedAnswer}
                    onClick={handlePopoverOpen} // Open popover on click
                >
                    {strippedAnswer}
                </TableCell>

                <TableCell>
                    <Label
                        variant="soft"
                        color={(row.status === 'Active' && 'success') || (row.status === 'Inactive' && 'error') || 'default'}
                    >
                        {row.status}
                    </Label>
                </TableCell>
                <TableCell>
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Quick Edit" arrow>
                            <Link component={RouterLink} to={`/settings/faq/edit/${row.id}`} sx={{ textDecoration: 'none' }}>
                                <IconButton>
                                    <Iconify icon="solar:pen-bold" />
                                </IconButton>
                            </Link>
                        </Tooltip>
                        <Tooltip title="More Actions" arrow>
                        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                            <Iconify icon="eva:more-vertical-fill" />
                        </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>

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
                        to={`/settings/faq/view/${row.id}`} // Set the destination URL
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
                        fetchFAQData();
                        confirm.onFalse();
                    }}>
                        Delete
                    </Button>
                }
            />
        </>
    );
}
