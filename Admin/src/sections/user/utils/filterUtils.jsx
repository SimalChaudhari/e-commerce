export function applyFilter({ inputData, comparator, filters }) {
  const { searchTerm, role, status } = filters;

  // Start by filtering based on status
  let filteredData = [...inputData];

  // Apply role filter
  if (role.length > 0) {
    filteredData = filteredData.filter((user) => role.includes(user.role));
  }
  
  // Filter by status (only filter if the status is not 'all')
  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  // If there's a search term, filter by first name, last name, or email
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();

    filteredData = filteredData.filter((item) =>
      item.firstName.toLowerCase().includes(lowerSearchTerm) ||
      item.lastName.toLowerCase().includes(lowerSearchTerm) ||
      item.email.toLowerCase().includes(lowerSearchTerm) ||
      item.role.toLowerCase().includes(lowerSearchTerm) 
    );
  }

  // Sort the filtered data using the comparator
  return filteredData.sort(comparator);
}


export function applyFilterAddress({ inputData, comparator, filters }) {
  const { searchTerm, status } = filters;

  // Start by filtering based on status
  let filteredData = inputData;

  // Filter by status (only filter if the status is not 'all')
  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  // If there's a search term, filter by first name, last name, or email
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();

    filteredData = filteredData.filter((item) =>
      item.street_address.toLowerCase().includes(lowerSearchTerm) ||
      item.city.toLowerCase().includes(lowerSearchTerm) ||
      item.state.toLowerCase().includes(lowerSearchTerm)
    );
  }

  // Sort the filtered data using the comparator
  return filteredData.sort(comparator);
}

