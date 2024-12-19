export function applyFilter({ inputData, comparator, filters }) {
  const { searchTerm } = filters;

  // Start by filtering based on status
  let filteredData = inputData;

  // If there's a search term, filter by first name, last name, or email
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();

    filteredData = filteredData.filter((item) =>
      item && // Ensure `item` is defined
      ((item.accountName || '').toLowerCase().includes(lowerSearchTerm) ||
        (item.type || '').toLowerCase().includes(lowerSearchTerm) ||
        (item.accountNumber || '').toLowerCase().includes(lowerSearchTerm) ||
        (item.ifscCode || '').toLowerCase().includes(lowerSearchTerm) ||
        (item.upiId || '').toLowerCase().includes(lowerSearchTerm) ||
        (item.paypalEmail || '').toLowerCase().includes(lowerSearchTerm))
    );
  }

  // Sort the filtered data using the comparator
  return filteredData.sort(comparator);
}
