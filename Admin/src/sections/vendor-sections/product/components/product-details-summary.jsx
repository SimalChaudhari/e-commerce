import { useEffect, useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { fCurrency, fShortenNumber } from 'src/utils/format-number';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { ColorPicker } from 'src/components/color-utils';
import { IncrementerButton } from './incrementer-button';
import { addToCart, cartList} from 'src/store/action/cartActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

const MOCK_PRODUCT = {
  id: 1,
  name: 'Stylish Sneakers',
  sizes: ['S', 'M', 'L', 'XL'],
  price: 79.99,
  coverUrl: 'https://via.placeholder.com/600x400?text=Stylish+Sneakers',
  colors: ['#FF5733', '#33FF57', '#3357FF'], // Color hex codes
  newLabel: true,
  available: true,
  priceSale: 59.99,
  saleLabel: '20% OFF',
  totalRatings: 4.5,
  totalReviews: 120,
  inventoryType: 'inStock', // or 'outOfStock'
  subDescription: 'Comfortable and stylish sneakers suitable for all occasions.',
};

// ----------------------------------------------------------------------

export function ProductDetailsSummary({
  items,
  products,
  onAddCart,
  onGotoStep,
  disableActions,
  ...other
}) {

  const product = MOCK_PRODUCT;

  const {
    id,
    name,
    sizes,
    price,
    coverUrl,
    colors,
    available,
    totalRatings,
    totalReviews,
    inventoryType,
  } = product;


  const defaultValues = {
    id,
    name,
    coverUrl,
    available,
    price,
    colors: colors[0],
    size: sizes[4],
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({ defaultValues });

  const { reset, watch, control, setValue, handleSubmit } = methods;
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [quantity, setQuantity] = useState(1);


  // Handler to increase quantity
  const handleIncreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);

  };

  // Handler to decrease quantity
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };


  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {


  });


  const handleAddCart = async () => { // Adjust to accept id and quantity
    const data = { productId: products.id, quantity };
    try {
      const res = await dispatch(addToCart(data));

    } catch (error) {
      console.error('Submission failed', error);
    }
  }




  const handleBuyProduct = async () => { // Adjust to accept id and quantity
    const data = { productId: products.id, quantity };
    try {
      const res = await dispatch(addToCart(data));
      if (res) {
        navigate('/items/checkout?step=0')
      }
    } catch (error) {
      console.error('Submission failed', error);
    }
  }


  const fetchData = async () => {
    await dispatch(cartList());
  };

  const renderPrice = (
    <Box sx={{ typography: 'h5' }}>
      {products?.itemName}
      <Typography variant="h6" sx={{ flexGrow: 1, mt: 1 }}>
        {fCurrency(products?.sellingPrice)}
      </Typography>

    </Box>
  );


  const renderQuantity = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Quantity
      </Typography>

      <Stack spacing={1}>
        <IncrementerButton
          name="quantity"
          quantity={quantity}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
        />

        <Typography variant="caption" component="div" sx={{ textAlign: 'right' }}>
          Available: {available}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row" spacing={2}>
      <Button
        fullWidth
        size="large"
        color="warning"
        variant="contained"
        startIcon={<Iconify icon="solar:cart-plus-bold" width={24} />}
        onClick={handleAddCart}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Add to cart
      </Button>

      <Button onClick={handleBuyProduct} fullWidth size="large" type="submit" variant="contained" >
        Buy now
      </Button>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {products?.description}
    </Typography>
  );

  const renderRating = (
    <Stack direction="row" alignItems="center" sx={{ color: 'text.disabled', typography: 'body2' }}>
      <Rating size="small" value={totalRatings} precision={0.1} readOnly sx={{ mr: 1 }} />
      {`(${fShortenNumber(totalReviews)} reviews)`}
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'out of stock' && 'error.main') ||
          (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderInventoryType}


          {renderRating}

          {renderPrice}

          {renderSubDescription}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />



        {renderQuantity}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {renderActions}

      </Stack>
    </Form>
  );
}
