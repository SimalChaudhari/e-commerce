import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { PAYMENT_GET_BY_LIST, PAYMENT_LIST } from "../constants/actionTypes";

// FAQ Settings
export const paymentList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/bank-accounts/get');
        dispatch({
            type: PAYMENT_LIST,
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

export const paymentGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/bank-accounts/get/${id}`);
        dispatch({
            type: PAYMENT_GET_BY_LIST,
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

export const createPayment = (data) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/bank-accounts/create', data);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Payment created successfully!');
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

export const editPayment = (id, data) => async (dispatch) => {
    try {
        const response = await axiosInstance.put(`/bank-accounts/update/${id}`, data);

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Payment updated successfully!');
            return true; // Indicate successful update
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deletePayment = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/bank-accounts/delete/${id}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Payment deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteQRPayment = (id) => async (dispatch) => {
    try {
        await axiosInstance.delete(`/bank-accounts/remove-qr-image/${id}`);
        return true; // Indicate successful deletion

    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

