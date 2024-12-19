import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

export function UserTableToolbar({ filters, options, onResetPage, tableData }) {
  const popover = usePopover();

  // Filter by name (search term)
  const handleFilterName = useCallback(
    (event) => {
      onResetPage(); // Reset to the first page
      filters.setState({ searchTerm: event.target.value });
    },
    [filters, onResetPage]
  );

  // Filter by role
  const handleFilterRole = useCallback(
    (event) => {
      const newValue =
        typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

      onResetPage(); // Reset to the first page
      filters.setState({ role: newValue });
    },
    [filters, onResetPage]
  );

  // Function to handle printing the table
  const handlePrint = useCallback(() => {
    window.print(); // Opens the browser's print dialog
  }, []);

  // Function to export the table data to CSV
const handleExport = useCallback(() => {
  const csvData = tableData.map((row, index) => ({
    Index: index + 1,
    Name: `"${row.firstName} ${row.lastName}"`, // Enclose names in quotes to handle commas
    Email: `"${row.email}"`,                    // Enclose emails in quotes
    Mobile: `'${row.mobile}`,                   // Treat mobile numbers as strings with leading quote
    Role: `"${row.role}"`,                      // Enclose role in quotes
    Status: `"${row.status}"`                   // Enclose status in quotes
  }));

  const csvRows = [
    ['#', 'Name', 'Email', 'Mobile', 'Role', 'Status'], // CSV header
    ...csvData.map((row) => [
      row.Index,
      row.Name,
      row.Email,
      row.Mobile,
      row.Role,
      row.Status,
    ]),
  ];

  const csvContent = csvRows.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'users_data.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}, [tableData]);

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >

        {/* Role Filter */}
        <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
          <InputLabel htmlFor="user-filter-role-select-label">Role</InputLabel>
          <Select
            multiple
            value={filters.state.role}
            onChange={handleFilterRole}
            input={<OutlinedInput label="Role" />}
            renderValue={(selected) => selected.map((value) => value).join(', ')}
            inputProps={{ id: 'user-filter-role-select-label' }}
            MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
          >
            {options.roles.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox
                  disableRipple
                  size="small"
                  checked={filters.state.role.includes(option)}
                />
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Search Filter */}
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={filters.state.searchTerm}
            onChange={handleFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* More options: Print and Export */}
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </Stack>

      {/* Popover for Print and Export */}
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {/* Print Option */}
          <MenuItem
            onClick={() => {
              handlePrint();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            Print
          </MenuItem>

          {/* Export Option */}
          <MenuItem
            onClick={() => {
              handleExport();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            Export
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
