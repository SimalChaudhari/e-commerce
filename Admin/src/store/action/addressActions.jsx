import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { ADDRESS_LIST,ADDRESS_BY_LIST } from "../constants/actionTypes";

export const addressList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/addresses');
         dispatch({
            type: ADDRESS_LIST,
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

export const addressGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/addresses/get/${id}`);
        console.log("🚀 ~ addressGetByList ~ response:", response)

         dispatch({
            type: ADDRESS_BY_LIST,
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

export const createAddress = (addressData) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/addresses/create', addressData);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Address created successfully!');
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

export const updateAddress = (addressId, addressData) => async (dispatch) => {
    try {
        const response = await axiosInstance.put(`/addresses/update/${addressId}`, addressData);

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Address updated successfully!');
            return true; // Indicate successful update
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteAddress = (addressId) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/addresses/delete/${addressId}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Address deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};