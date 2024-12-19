import { useCallback, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { Grid, InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function ProductTableToolbar({ options, filters, onResetPage }) {
    const [selectedGroups, setSelectedGroups] = useState(filters.state.group || []);
    const [availableSubGroup1, setAvailableSubGroup1] = useState([]);
    const [selectedSubGroup1, setSelectedSubGroup1] = useState(filters.state.subGroup1 || []);
    const [availableSubGroup2, setAvailableSubGroup2] = useState([]);
    const [selectedSubGroup2, setSelectedSubGroup2] = useState(filters.state.subGroup2 || []);

    const uniqueGroups = Array.from(
        new Set(options.map((option) => option.group))
    );

    useEffect(() => {
        const filteredOptions = options.filter(
            (option) => selectedGroups.length === 0 || selectedGroups.includes(option.group)
        );

        const availableSubGroup1Set = new Set();
        const availableSubGroup2Set = new Set();

        filteredOptions.forEach((option) => {
            availableSubGroup1Set.add(option.subGroup1);
            if (
                selectedGroups.includes(option.group) ||
                selectedSubGroup1.includes(option.subGroup1)
            ) {
                availableSubGroup2Set.add(option.subGroup2);
            }
        });

        setAvailableSubGroup1(Array.from(availableSubGroup1Set));
        setAvailableSubGroup2(Array.from(availableSubGroup2Set));

        filters.setState((prev) => ({
            ...prev,
            subGroup1: prev.subGroup1.filter((sub) => availableSubGroup1Set.has(sub)),
            subGroup2: prev.subGroup2.filter((sub) => availableSubGroup2Set.has(sub)),
        }));
    }, [selectedGroups, selectedSubGroup1, options]);

    const handleFilterGroup = useCallback(
        (event, newValue) => {
            onResetPage();
            setSelectedGroups(newValue);
            filters.setState({ group: newValue });
            setSelectedSubGroup1([]);
            setSelectedSubGroup2([]);
        },
        [filters, onResetPage]
    );

    const handleFilterSubGroup1 = useCallback(
        (event, newValue) => {
            onResetPage();
            setSelectedSubGroup1(newValue);
            filters.setState({ subGroup1: newValue });
            setSelectedSubGroup2([]);
        },
        [filters, onResetPage]
    );

    const handleFilterSubGroup2 = useCallback(
        (event, newValue) => {
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
      
        <Stack sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}>
          <Grid container spacing={2}>
            {/* Group Filter with Search */}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={uniqueGroups}
                value={selectedGroups}
                onChange={handleFilterGroup}
                renderInput={(params) => (
                  <TextField {...params} label="Group" placeholder="Search Group" />
                )}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      style={{ marginRight: 8 }}
                      checked={selectedGroups.includes(option)}
                    />
                    {option}
                  </li>
                )}
              />
            </Grid>
        
            {/* SubGroup1 Filter with Search */}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={availableSubGroup1}
                value={selectedSubGroup1}
                onChange={handleFilterSubGroup1}
                renderInput={(params) => (
                  <TextField {...params} label="Sub-Group 1" placeholder="Search Sub-Group 1" />
                )}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      style={{ marginRight: 8 }}
                      checked={selectedSubGroup1.includes(option)}
                    />
                    {option}
                  </li>
                )}
              />
            </Grid>
        
            {/* SubGroup2 Filter with Search */}
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                options={availableSubGroup2}
                value={selectedSubGroup2}
                onChange={handleFilterSubGroup2}
                renderInput={(params) => (
                  <TextField {...params} label="Sub-Group 2" placeholder="Search Sub-Group 2" />
                )}
                disableCloseOnSelect
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      style={{ marginRight: 8 }}
                      checked={selectedSubGroup2.includes(option)}
                    />
                    {option}
                  </li>
                )}
              />
            </Grid>
        
            {/* Search Filter */}
            <Grid item xs={12} sm={12} md={12}>
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
            </Grid>
          </Grid>
        </Stack>
        
    );
}
