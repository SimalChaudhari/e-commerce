import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { ORDER_LIST, ORDER_BY_LIST } from "../constants/actionTypes";

export const syncOrder = () => async (dispatch) => {
    try {
        const { data } = await axiosInstance.post('/retry-invoice/post-pending');

        if (data) {
            const { message, status } = data;
          
            if (status === 'success') {
                toast.success(message);
            } else if (status === 'error') {
                toast.error(message);
            } else if (status === 'partial_success') {
                toast.warning(message);
            }
        }

        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        toast.error(errorMessage);
        return false;
    }
}

export const orderList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/order/get');
        dispatch({
            type: ORDER_LIST,
            payload: response.data, // Assuming response contains the customers data
        });
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const orderGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/order/${id}`);

        dispatch({
            type: ORDER_BY_LIST,
            payload: response.data, // Assuming response contains the customers data
        });
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const createOrder = (data) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/order/generate', data);
        return response;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const createOrderItem = (data) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/order/add-items', data);

        if (response && response.status >= 200 && response.status < 300) {
            toast.success('Order Has been Placed successfully!');
            return true;
        }
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const deleteOrder = (id) => async (dispatch) => {

    try {
        const response = await axiosInstance.delete(`/order/delete/${id}`);

        if (response && response.status >= 200 && response.status < 300) {
            toast.success('Order Has been Deleted successfully!');
            return true;
        }
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const deleteAllItem = (ids) => async (dispatch) => {
    try {
        // Pass ids as the data property in the axios delete request
        const response = await axiosInstance.delete(`/order/delete/orders/all`, {
            data: { ids }
        });

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'orders deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};