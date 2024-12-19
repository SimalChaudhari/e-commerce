import { useDispatch } from 'react-redux';
import { logsList } from 'src/store/action/logsActions';

export const useFetchOrderData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(logsList());
  };



  return { fetchData };
};

