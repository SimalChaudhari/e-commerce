import { useCallback, useState, useEffect, useMemo } from 'react';
import { Stack, Checkbox, FormControl, Autocomplete, TextField } from '@mui/material';

export function ProductToolbar({ options, filters, clearFilters }) {
    const [selectedGroups, setSelectedGroups] = useState(filters.state.group || []);
    const [selectedSubGroup1, setSelectedSubGroup1] = useState(filters.state.subGroup1 || []);
    const [selectedSubGroup2, setSelectedSubGroup2] = useState(filters.state.subGroup2 || []);

    // Compute unique groups only once
    const uniqueGroups = useMemo(
        () =>
            Array.from(
                new Set(options.map(option => option.group.toLowerCase()))
            ).map(group => options.find(option => option.group.toLowerCase() === group).group),
        [options]
    );
    

    // Filter available SubGroup1 and SubGroup2 based on selected Groups/SubGroup1
    const [availableSubGroup1, availableSubGroup2] = useMemo(() => {
        const filteredOptions = options.filter(
            option =>
                !selectedGroups.length || selectedGroups.includes(option.group)
        );

        const subGroup1Set = new Set();
        const subGroup2Set = new Set();

        filteredOptions.forEach(option => {
            if (selectedGroups.includes(option.group) || selectedSubGroup1.includes(option.subGroup1)) {
                subGroup1Set.add(option.subGroup1);
                subGroup2Set.add(option.subGroup2);
            }
        });

        return [Array.from(subGroup1Set), Array.from(subGroup2Set)];
    }, [options, selectedGroups, selectedSubGroup1]);

    // Ensure filters are updated when available options change
    useEffect(() => {
        filters.setState(prev => ({
            ...prev,
            subGroup1: prev.subGroup1.filter(sub => availableSubGroup1.includes(sub)),
            subGroup2: prev.subGroup2.filter(sub => availableSubGroup2.includes(sub)),
        }));
    }, [availableSubGroup1, availableSubGroup2, filters]);

    // Clear all filters
    useEffect(() => {
        clearFilters.current = () => {
            setSelectedGroups([]);
            setSelectedSubGroup1([]);
            setSelectedSubGroup2([]);
            filters.setState({ group: [], subGroup1: [], subGroup2: [] });
        };
    }, [clearFilters, filters]);

    // Handlers for filter changes
    const handleFilterGroup = useCallback(
        (event, newValue) => {
            setSelectedGroups(newValue);
            filters.setState({ group: newValue });
            setSelectedSubGroup1([]); // Reset SubGroup1 on group change
            setSelectedSubGroup2([]); // Reset SubGroup2 on group change
        },
        [filters]
    );

    const handleFilterSubGroup1 = useCallback(
        (event, newValue) => {
            setSelectedSubGroup1(newValue);
            filters.setState({ subGroup1: newValue });
            setSelectedSubGroup2([]); // Reset SubGroup2 on SubGroup1 change
        },
        [filters]
    );

    const handleFilterSubGroup2 = useCallback(
        (event, newValue) => {
            setSelectedSubGroup2(newValue);
            filters.setState({ subGroup2: newValue });
        },
        [filters]
    );

    return (
        <Stack
            spacing={2}
            direction="row"
            sx={{
                width: '100%',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            {/* Group Filter */}
            <FormControl sx={{ flex: 1, minWidth: 200 }}>
                <Autocomplete
                    multiple
                    options={uniqueGroups}
                    value={selectedGroups}
                    onChange={handleFilterGroup}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                disableRipple
                                size="small"
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Group"
                            placeholder="Select groups"
                            variant="outlined"
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option === value}
                />
            </FormControl>

            {/* SubGroup1 Filter */}
            <FormControl sx={{ flex: 1, minWidth: 200 }}>
                <Autocomplete
                    multiple
                    options={availableSubGroup1}
                    value={selectedSubGroup1}
                    onChange={handleFilterSubGroup1}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                disableRipple
                                size="small"
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Sub-Group 1"
                            placeholder="Select sub-groups"
                            variant="outlined"
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option === value}
                />
            </FormControl>

            {/* SubGroup2 Filter */}
            <FormControl sx={{ flex: 1, minWidth: 200 }}>
                <Autocomplete
                    multiple
                    options={availableSubGroup2}
                    value={selectedSubGroup2}
                    onChange={handleFilterSubGroup2}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                disableRipple
                                size="small"
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Sub-Group 2"
                            placeholder="Select sub-groups"
                            variant="outlined"
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option === value}
                />
            </FormControl>
        </Stack>
    );
}
