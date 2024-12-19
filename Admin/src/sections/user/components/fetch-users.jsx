import { useDispatch } from 'react-redux';
import { addressList, deleteAddress } from 'src/store/action/addressActions';
import { deleteUser, userList } from 'src/store/action/userActions';


export const useFetchUserData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(userList());
  };

  const fetchDeleteData = async (id) => {

    try {
      const response = await dispatch(deleteUser(id));;
      if (response) {
        fetchData(); // Refetch category data only on successful deletion
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };


  return { fetchData, fetchDeleteData };
};

export const useFetchAddressData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(addressList());
  };

  const fetchDeleteData = async (id) => {
    try {
      const response = await dispatch(deleteAddress(id));
      if (response) {
        fetchData(); // Refetch category data only on successful deletion
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return { fetchData, fetchDeleteData };
};
