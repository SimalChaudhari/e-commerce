import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export function BannerTableToolbar({ filters, onResetPage }) {
    const popover = usePopover();

    // Handle filter by search term
    const handleFilterName = useCallback(
        (event) => {
            onResetPage();
            filters.setState({ searchTerm: event.target.value });
        },
        [filters, onResetPage]
    );

    return (
        <>
            <Stack
                spacing={2}
                alignItems={{ xs: 'flex-end', md: 'center' }}
                direction={{ xs: 'column', md: 'row' }}
                sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
            >
                {/* Search Filter */}
                <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                    <TextField
                        fullWidth
                        value={filters.state.searchTerm}
                        onChange={handleFilterName}
                        placeholder="Search banners..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                   
                </Stack>
            </Stack>

            {/* Popover Menu for additional actions */}
            <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
            >
                <MenuList>
                    <MenuItem onClick={popover.onClose}>
                        <Iconify icon="solar:printer-minimalistic-bold" />
                        Print Banners
                    </MenuItem>

                    <MenuItem onClick={popover.onClose}>
                        <Iconify icon="solar:import-bold" />
                        Import Banners
                    </MenuItem>

                    <MenuItem onClick={popover.onClose}>
                        <Iconify icon="solar:export-bold" />
                        Export Banners
                    </MenuItem>
                </MenuList>
            </CustomPopover>
        </>
    );
}
