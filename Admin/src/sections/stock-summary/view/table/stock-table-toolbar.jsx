import { useCallback, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from 'src/components/iconify';
import { usePopover } from 'src/components/custom-popover';

export function StockTableToolbar({ options, filters, onResetPage }) {
    const popover = usePopover();
    const [selectedGroups, setSelectedGroups] = useState(filters.state.group || []);
    const [availableSubGroup1, setAvailableSubGroup1] = useState([]);
    const [selectedSubGroup1, setSelectedSubGroup1] = useState(filters.state.subGroup1 || []);
    const [availableSubGroup2, setAvailableSubGroup2] = useState([]);
    const [selectedSubGroup2, setSelectedSubGroup2] = useState(filters.state.subGroup2 || []);

    // const [triggerUpdate, setTriggerUpdate] = useState(false); // State to trigger useEffect manually
    // setTriggerUpdate(!triggerUpdate)

    const uniqueGroups = Array.from(
        new Set(options.map(option => option.group.toLowerCase()))
    ).map(group => options.find(option => option.group.toLowerCase() === group).group);

    useEffect(() => {
        // Filtered options based on selected groups only
        const filteredOptions = options.filter(option => {
            const matchesGroup = selectedGroups.length === 0 || selectedGroups.includes(option.group);
            return matchesGroup;
        });
    
        // Update available SubGroup1 based on selected Groups only
        const availableSubGroup1Set = new Set();
        const availableSubGroup2Set = new Set();
    
        filteredOptions.forEach(option => {
            if (selectedGroups.includes(option.group)) {
                availableSubGroup1Set.add(option.subGroup1);
            }
        });
    
        // Update available SubGroup1 without removing options based on SubGroup2
        setAvailableSubGroup1(Array.from(availableSubGroup1Set));
    
        // Update available SubGroup2 based on selected groups and subgroup1 without restriction from each other
        options.forEach(option => {
            if (selectedGroups.includes(option.group) || selectedSubGroup1.includes(option.subGroup1)) {
                availableSubGroup2Set.add(option.subGroup2);
            }
        });
    
        setAvailableSubGroup2(Array.from(availableSubGroup2Set));
    
        // Filter selected subgroups to ensure they are valid with the new available options
        filters.setState(prev => ({
            ...prev,
            subGroup1: prev.subGroup1.filter(sub => availableSubGroup1Set.has(sub)),
            subGroup2: prev.subGroup2.filter(sub => availableSubGroup2Set.has(sub)),
        }));
    // }, [selectedGroups, options, selectedSubGroup1, filters]);
    }, [selectedGroups, selectedSubGroup1]);

    
    // Handle filter changes
    const handleFilterGroup = useCallback(
        (event) => {
            const newValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
            onResetPage();
            setSelectedGroups(newValue);
            filters.setState({ group: newValue });
            setSelectedSubGroup1([]); // Reset SubGroup1 on group change
            setSelectedSubGroup2([]); // Reset SubGroup2 on group change
        },
        [filters, onResetPage]
    );

    const handleFilterSubGroup1 = useCallback(
        (event) => {
            const newValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
            onResetPage();
            setSelectedSubGroup1(newValue);
            filters.setState({ subGroup1: newValue });
            setSelectedSubGroup2([]); // Reset SubGroup2 on SubGroup1 change
        },
        [filters, onResetPage]
    );

    const handleFilterSubGroup2 = useCallback(
        (event) => {
            const newValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;
            onResetPage();
            setSelectedSubGroup2(newValue);
            filters.setState({ subGroup2: newValue });
        },
        [filters, onResetPage]
    );

    const handleFilterName = useCallback(
        (event) => {
            filters.setState({ searchTerm: event.target.value });
            onResetPage();

        },
        [filters, onResetPage]
    );
    // Sync state with filters
    useEffect(() => {
        setSelectedGroups(filters.state.group || []); // Ensure it's always an array
        setSelectedSubGroup1(filters.state.subGroup1 || []); // Ensure it's always an array
        setSelectedSubGroup2(filters.state.subGroup2 || []); // Ensure it's always an array
    }, [filters.state.group, filters.state.subGroup1, filters.state.subGroup2]);

    return (

        <Stack
            spacing={2}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            direction={{ xs: 'column', md: 'row' }}
            sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
        >
            {/* Group Filter
            
            <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
                <InputLabel htmlFor="group-filter-select-label">Group</InputLabel>
                <Select
                    multiple
                    value={selectedGroups}
                    onChange={handleFilterGroup}
                    input={<OutlinedInput label="Group" />}
                    renderValue={(selected) => selected.join(', ')}
                    inputProps={{ id: 'group-filter-select-label' }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                >
                    {uniqueGroups.map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={selectedGroups.includes(option)}
                            />
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
             */}

            {/* SubGroup1 Filter
            <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
                <InputLabel htmlFor="subgroup1-filter-select-label">Sub-Group 1</InputLabel>
                <Select
                    multiple
                    value={selectedSubGroup1}
                    onChange={handleFilterSubGroup1}
                    input={<OutlinedInput label="SubGroup1" />}
                    renderValue={(selected) => selected.join(', ')}
                    inputProps={{ id: 'subgroup1-filter-select-label' }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                >
                    {availableSubGroup1.map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={selectedSubGroup1.includes(option)}
                            />
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
             */}

            {/* SubGroup2 Filter 
            <FormControl sx={{ flexShrink: 0, width: { xs: 1, md: 200 } }}>
                <InputLabel htmlFor="subgroup2-filter-select-label">Sub-Group 2</InputLabel>
                <Select
                    multiple
                    value={selectedSubGroup2}
                    onChange={handleFilterSubGroup2}
                    input={<OutlinedInput label="SubGroup2" />}
                    renderValue={(selected) => selected.join(', ')}
                    inputProps={{ id: 'subgroup2-filter-select-label' }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 240 } } }}
                >
                    {availableSubGroup2.map((option) => (
                        <MenuItem key={option} value={option}>
                            <Checkbox
                                disableRipple
                                size="small"
                                checked={selectedSubGroup2.includes(option)}
                            />
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>  */}

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
            </Stack>
        </Stack>

    );
}
