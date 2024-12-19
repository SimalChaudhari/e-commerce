import { useDispatch } from 'react-redux';
import { deleteVendor, vendorList,deleteAllItem } from 'src/store/action/vendorActions';

export const useFetchVendorData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(vendorList());
  };

  const fetchDeleteData = async (id) => {

    try {
      const response = await dispatch(deleteVendor(id));;
      if (response) {
        fetchData(); // Refetch 
      }
    } catch (error) {
      console.error("Error deletingVendor:", error);
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



  return { fetchData, fetchDeleteData,deleteAllItems };
};

