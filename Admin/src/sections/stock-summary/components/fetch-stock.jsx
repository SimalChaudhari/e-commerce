import { useDispatch } from 'react-redux';
import { deleteAllItem, stockList } from 'src/store/action/stockSummaryActions';


export const useFetchStockData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(stockList());
  };

  const deleteAllItems = async (id) => {
    try {
      const response = await dispatch(deleteAllItem(id));;
      if (response) {
        fetchData(); // Refetch data data only on successful deletion
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };


  return { fetchData,deleteAllItems};
};

