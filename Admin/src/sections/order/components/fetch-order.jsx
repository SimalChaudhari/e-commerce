import { useDispatch } from 'react-redux';
import { deleteOrder, orderGetByList, orderList,deleteAllItem } from 'src/store/action/orderActions';


export const useFetchOrderData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(orderList());
  };

  const fetchByIdData = async (id) => {
    await dispatch(orderGetByList(id));
  };


  const fetchDeleteData = async (id) => {

    try {
      const response = await dispatch(deleteOrder(id));;
      if (response) {
        fetchData(); // Refetch product data only on successful deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
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

  return { fetchData, fetchByIdData, fetchDeleteData,deleteAllItems };
};

