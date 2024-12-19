export function applyFilter({ inputData, comparator, filters }) {
    const { searchTerm } = filters;
  
    // Start by filtering based on status
    let filteredData = inputData;
  
    // If there's a search term, filter by first name, last name, or email
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
  
      filteredData = filteredData.filter((item) =>
        item.content.toLowerCase().includes(lowerSearchTerm) 
      )
    }
  
    // Sort the filtered data using the comparator
    return filteredData.sort(comparator);
  }
  
  