import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { ItemCard } from './item-cards';
// ----------------------------------------------------------------------
export function ItemCardList({ products }) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 12;
  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  return (
    <>  
      <Box
        gap={1}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)', // 2 columns on extra small screens
          sm: 'repeat(2, 1fr)', // 3 columns on small screens
          md: 'repeat(3, 1fr)', // 3 columns on medium screens
          lg: 'repeat(4, 1fr)', // 4 columns on large screens
        }}
        sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 2, sm: 3 } }} // Add padding for the container
      >
        {products
          .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
          .map((product) => (
            <ItemCard key={product.id} product={product} />
          ))}
      </Box>

      <Pagination
        page={page}
        shape="circular"
        count={Math.ceil(products.length / rowsPerPage)}
        onChange={handleChangePage}
        sx={{ mt: { xs: 5, md: 8 }, mx: 'auto' }}
      />
    </>
  );
}
