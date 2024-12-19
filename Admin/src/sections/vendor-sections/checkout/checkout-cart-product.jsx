import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { fCurrency } from 'src/utils/format-number';
import { Iconify } from 'src/components/iconify';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { TextField, Tooltip, CircularProgress, FormHelperText, InputAdornment } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addQuantity, cartList } from 'src/store/action/cartActions';
import { Link } from 'react-router-dom';
import { DUMMY_IMAGE } from 'src/components/constants';

// ----------------------------------------------------------------------

export function CheckoutCartProduct({ productID, row, onDownload, onDelete }) {
  const isDownloadable = !!row.dimensionalFiles; // Check if pdfPath is available

  const available = row.stockQuantity; // Change this to 0 to simulate product not available

  const [quantity, setQuantity] = useState(row.quantity); // Quantity state
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [isTickVisible, setIsTickVisible] = useState(false); // State for showing the green tick
  const [errorMessage, setErrorMessage] = useState(""); // State for error message when quantity exceeds available stock
  const [productUnavailableMessage, setProductUnavailableMessage] = useState(""); // State for unavailable message
  const dispatch = useDispatch();
  const handleQuantityChange = (e) => {
    let newQuantity = e.target.value.trim() === "" ? "" : parseInt(e.target.value, 10); // Handle empty input

    // Handle empty quantity case
    if (newQuantity === "") {
      setErrorMessage("Please enter quantity");
      setIsTickVisible(false);
    } else {
      setErrorMessage(""); // Clear error message when valid input is provided
    }


    // Check if the product is unavailable
    if (available === 0) {
      setProductUnavailableMessage("Product not available currently");
      newQuantity = 0; // Set quantity to 0 if product is unavailable
    } else {
      setProductUnavailableMessage(""); // Clear the unavailable message if product is available
    }

    // Check for negative quantity
    if (newQuantity < 0) {
      newQuantity = 0; // Reset to 0 if negative quantity is entered
      setErrorMessage("Quantity cannot be negative");
    } else if (newQuantity === 0) {
      setErrorMessage(`Maximum 1 quantity add`); // Show error message if quantity exceeds available stock
    } else if (newQuantity > available) {
      setErrorMessage(`Maximum available quantity is ${available}`); // Show error message if quantity exceeds available stock
      newQuantity = available; // Limit the quantity to the available stock
    }

    setQuantity(newQuantity); // Update the quantity state immediately
    setIsLoading(true); // Show loader when quantity changes

    // Clear any previous timeout and start a new one
    clearTimeout(window.quantityTimeout);
    window.quantityTimeout = setTimeout(() => {
      setIsLoading(false); // Hide loader after the delay
      if (newQuantity <= available && newQuantity !== "") {
        setIsTickVisible(true); // Show green tick only if quantity is valid
        // Only submit if quantity is greater than 0
        if (newQuantity > 0) {
          submitQuantity(newQuantity);
        }
      }
    }, 2000); // 5 seconds delay
  };

  const submitQuantity = async (newQuantity) => {
    // Simulate API call for quantity submission
    console.log(`Submitting quantity: ${newQuantity}`);
    const response = await dispatch(addQuantity(row.id, newQuantity));
    if (response) {
      await dispatch(cartList());
    }
    // Call your API function here
    // await api.submitQuantity(newQuantity);
  };

  return (
    <TableRow>
      <TableCell>

        <Link
          to={`/items/view/${productID}`}
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
        >
          <Stack spacing={2} direction="row" alignItems="center" sx={{ cursor: "pointer" }}>
            <Avatar
              variant="rounded"
              alt={row?.productImages?.[0] || "Product Image"}
              src={row?.productImages && row?.productImages?.length ? row.productImages?.[0] : DUMMY_IMAGE}
              // sx={{ width: 64, height: 64 }}
            />
            <Stack spacing={0.5}>
              <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
                {row.name}
              </Typography>
              {/* Secondary data */}
              <Tooltip title={row.description} arrow>
                <Typography noWrap variant="body2" color="textSecondary" sx={{ maxWidth: 240 }}>
                  {row.description} {/* Secondary data */}
                </Typography>
              </Tooltip>
            </Stack>

          </Stack>
        </Link>

      </TableCell>

      <TableCell>{fCurrency(row.price)}</TableCell>

      <TableCell align="center">
        {available === 0 ? (
          <Typography color="error">Product not available currently</Typography> // Show message if not available
        ) : (
          <TextField
            fullWidth
            type="number"
            value={quantity}  // Always use the current valid quantity
            onChange={handleQuantityChange} // Now the onChange handler is active
            sx={{
              width: 200, // Fixed width for the input field
              textAlign: 'center',
              fontSize: '16px',
              backgroundColor: 'transparent',
              color: 'inherit',
            }}
            inputProps={{
              style: {
                textAlign: 'center', // Align text to center inside the input
              },
            }}
            InputProps={{
              endAdornment: isLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : isTickVisible && quantity !== "" && quantity !== 0 ? (
                <InputAdornment position="end">
                  <CheckCircleIcon sx={{ color: 'green', fontSize: '20px' }} />
                </InputAdornment>
              ) : (
                <InputAdornment position="end">
                  <CheckCircleIcon sx={{ color: 'grey', fontSize: '20px' }} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Show error message if quantity exceeds available stock or if it's negative */}
        {errorMessage && (
          <FormHelperText error sx={{ marginRight: 3, textAlign: 'center' }}>
            {errorMessage}
          </FormHelperText>
        )}
      </TableCell>

      <TableCell align="center">{available}</TableCell>
      <TableCell align="center">{fCurrency(row.price * row.quantity)}</TableCell>

      <TableCell align="center" sx={{ px: 6 }}>
        <Tooltip title={isDownloadable ? "Download File" : "File not available"}>
          <span> {/* Wrap in span to allow tooltip on disabled button */}
            <IconButton
              onClick={() => isDownloadable && onDownload(row.id)}
              sx={{ color: 'primary.main' }}
              disabled={!isDownloadable} // Disable if no pdfPath
            >
              <Iconify icon="eva:download-outline" />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>

      <TableCell align="center" sx={{ px: 1 }}>
        <IconButton onClick={onDelete} sx={{ color: 'error.main' }}> {/* Use error color */}
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
