import { useDispatch } from 'react-redux';
import { deleteProduct, itemList, deleteItem, deleteAllItem } from 'src/store/action/productActions';


export const useFetchProductData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(itemList());
  };

  const fetchDeleteData = async (id) => {

    try {
      const response = await dispatch(deleteProduct(id));;
      if (response) {
        fetchData(); // Refetch product data only on successful deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const fetchDeleteItem = async (id) => {

    try {
      const response = await dispatch(deleteItem(id));;
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
        fetchData(); // Refetch product data only on successful deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };




  return { fetchData, fetchDeleteData, deleteAllItems, fetchDeleteItem };
};

