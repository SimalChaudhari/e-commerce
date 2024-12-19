import { useCallback } from 'react';
import Chip from '@mui/material/Chip';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

// ----------------------------------------------------------------------

export function StockTableFiltersResult({ filters, onResetPage, totalResults, sx, onClearGroup, onClearSubGroup1, onClearSubGroup2 }) {

  const handleRemoveSearchTerm = useCallback(() => {
    onResetPage();
    filters.setState({ searchTerm: '' });
  }, [filters, onResetPage]);
  

  const handleReset = useCallback(() => {
    onResetPage();
    filters.onResetState();
  }, [filters, onResetPage]);

  const handleResetFilter = useCallback((key, value, onClear, clearRelated = false) => {
    onResetPage();
    const updatedValues = filters.state[key].filter(item => item !== value);
    const newState = { [key]: updatedValues };

    // Clear related subgroups if specified
    if (clearRelated) {
      newState.subGroup1 = [];  // Clear all items in subGroup1
      newState.subGroup2 = [];  // Clear all items in subGroup2
      onClearSubGroup1();       // Trigger onClearSubGroup1 callback
      onClearSubGroup2();       // Trigger onClearSubGroup2 callback
    }

    filters.setState(newState);
    onClear(value); // Call the specific onClear callback for this item
  }, [filters, onResetPage, onClearSubGroup1, onClearSubGroup2]);

   // Check if any filters are active
   const hasFilters = 
   !!filters.state.searchTerm ||
   filters.state.group.length > 0 ||
   filters.state.subGroup1.length > 0 ||
   filters.state.subGroup2.length > 0;

 // If there are no active filters, do not render the FiltersResult component
 if (!hasFilters) return null;

  return (
    <FiltersResult totalResults={totalResults} onReset={handleReset} sx={sx}>
      <FiltersBlock label="Keyword:" isShow={!!filters.state.searchTerm}>
        <Chip
          {...chipProps}
          label={filters.state.searchTerm}
          onDelete={handleRemoveSearchTerm}
        />
      </FiltersBlock>

      <FiltersBlock label="Group:" isShow={!!filters.state.group.length}>
        {(filters.state.group || []).map((gp) => (
          <Chip
            {...chipProps}
            key={gp}
            label={gp}
            onDelete={() => handleResetFilter('group', gp, onClearGroup, true)} // Clear related subgroups as well
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="SubGroup1:" isShow={!!filters.state.subGroup1.length}>
        {(filters.state.subGroup1 || []).map((sub1) => (
          <Chip
            {...chipProps}
            key={sub1}
            label={sub1}
            onDelete={() => handleResetFilter('subGroup1', sub1, onClearSubGroup1)} // Clear only this subgroup1
          />
        ))}
      </FiltersBlock>

      <FiltersBlock label="SubGroup2:" isShow={!!filters.state.subGroup2.length}>
        {(filters.state.subGroup2 || []).map((sub2) => (
          <Chip
            {...chipProps}
            key={sub2}
            label={sub2}
            onDelete={() => handleResetFilter('subGroup2', sub2, onClearSubGroup2)} // Clear only this subgroup2
          />
        ))}
      </FiltersBlock>
    </FiltersResult>
  );
}
