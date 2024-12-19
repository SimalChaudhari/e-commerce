import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { addressList } from 'src/store/action/addressActions';

// Custom hook to get user address list
const useAddress = () => {
  const dispatch = useDispatch();

  // Get address data from Redux store
  const addressData = useSelector((state) => state.address?.address || []);

  useEffect(() => {
    // Dispatch the action to fetch addresses when the component mounts
    dispatch(addressList());
  }, [dispatch]);

  // Return the address data so it can be used in components
  return addressData;
};

export default useAddress;
