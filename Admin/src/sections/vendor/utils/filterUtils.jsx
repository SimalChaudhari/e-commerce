export function applyFilter({ inputData, comparator, filters }) {
  const { searchTerm, status } = filters;

  // Start by filtering based on status
  let filteredData = [...inputData];


  // Filter by status (only filter if the status is not 'all')
  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  // If there's a search term, filter by first name, last name, or email
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();

    filteredData = filteredData.filter((vendor) =>
      vendor.name.toLowerCase().includes(lowerSearchTerm) ||
      vendor.alias.toLowerCase().includes(lowerSearchTerm) ||
    
      vendor.address.toLowerCase().includes(lowerSearchTerm) ||
      vendor.country.toLowerCase().includes(lowerSearchTerm) ||
      vendor.state.toLowerCase().includes(lowerSearchTerm) ||
      vendor.pincode.toString().includes(lowerSearchTerm) || // Convert number to string for search
      vendor.mobile.includes(lowerSearchTerm) || // You can adjust this if you want a case-sensitive match
      vendor.email.toLowerCase().includes(lowerSearchTerm) 
    );
  }

  // Sort the filtered data using the comparator
  return filteredData.sort(comparator);
}


