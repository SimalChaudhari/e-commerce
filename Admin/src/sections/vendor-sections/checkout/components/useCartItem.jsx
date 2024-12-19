
import useCart from './useCart';

const useCartItem = (itemId) => {
  const cartItems = useCart();
  
  const cartItem = cartItems.find(item => item.productID === itemId);
  return cartItem;
};

export default useCartItem;
