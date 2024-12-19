import { useDispatch } from 'react-redux';
import { deleteAllItem, deleteReceivable, receivableGetByList, receivableList } from 'src/store/action/accountingActions';


export const useFetchData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(receivableList());
  };

  const fetchByIdData = async (id) => {
    await dispatch(receivableGetByList(id));
  };

  const fetchDeleteData = async (id) => {
    await dispatch(deleteReceivable(id));
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

  return { fetchData, fetchByIdData ,fetchDeleteData,deleteAllItems};
};

