import { useDispatch } from 'react-redux';
import { deleteProduct, itemList, productList } from 'src/store/action/productActions';


export const useFetchProductData = () => {
  const dispatch = useDispatch();

  const fetchData = async () => {
    await dispatch(itemList());
  };


  return { fetchData };
};

