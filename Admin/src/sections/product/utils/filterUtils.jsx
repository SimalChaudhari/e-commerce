export function applyFilter({ inputData, comparator, filters }) {
  const { searchTerm, status, group, subGroup1, subGroup2 } = filters;

  // Filter by status (only if the status is not 'all')
  let filteredData = status !== 'all' ?
      inputData.filter(item => item.status === status) :
      [...inputData]; // Use spread to create a shallow copy

  // If there's a search term, filter by various fields
  if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item =>
          item.itemName?.toLowerCase().includes(lowerSearchTerm) ||
          item.group?.toLowerCase().includes(lowerSearchTerm) ||
          item.subGroup1?.toLowerCase().includes(lowerSearchTerm) ||
          item.subGroup2?.toString().includes(lowerSearchTerm) ||
          item.sellingPrice?.toString().includes(lowerSearchTerm) ||
          item.description?.toString().includes(lowerSearchTerm)
      );
  }

  // Filter by group if it exists and is an array
  if (Array.isArray(group) && group.length > 0) {
      const lowerGroups = group.map(g => g.toLowerCase()); // Convert all to lowercase
      filteredData = filteredData.filter(item =>
          lowerGroups.includes(item.group?.toLowerCase()) // Check if item.group is in the lower case groups
      );
  }

  // Filter by subGroup1 if it exists and is an array
  if (Array.isArray(subGroup1) && subGroup1.length > 0) {
      const lowerSubGroups1 = subGroup1.map(sg => sg.toLowerCase());
      filteredData = filteredData.filter(item =>
          lowerSubGroups1.includes(item.subGroup1?.toLowerCase()) // Check if item.subGroup1 is in the lower case subgroups
      );
  } else if (subGroup1 && typeof subGroup1 === 'string') {
      // If a single string is provided, filter based on it
      const lowerSubGroup1 = subGroup1.toLowerCase();
      filteredData = filteredData.filter(item =>
          item.subGroup1?.toLowerCase().includes(lowerSubGroup1)
      );
  }

  // Filter by subGroup2 if it exists and is an array
  if (Array.isArray(subGroup2) && subGroup2.length > 0) {
      const lowerSubGroups2 = subGroup2.map(sg => sg.toLowerCase());
      filteredData = filteredData.filter(item =>
          lowerSubGroups2.includes(item.subGroup2?.toLowerCase()) // Check if item.subGroup2 is in the lower case subgroups
      );
  } else if (subGroup2 && typeof subGroup2 === 'string') {
      // If a single string is provided, filter based on it
      const lowerSubGroup2 = subGroup2.toLowerCase();
      filteredData = filteredData.filter(item =>
          item.subGroup2?.toLowerCase().includes(lowerSubGroup2)
      );
  }

  // Sort the filtered data using the comparator
  return filteredData.sort(comparator);
}
