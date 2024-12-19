import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { VENDOR_GET_BY_LIST, VENDOR_LIST } from "../constants/actionTypes";

export const vendorList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/vendors');
        dispatch({
            type: VENDOR_LIST,
            payload: response.data?.data, // Assuming response contains the customers data
        });
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const vendorGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/vendors/${id}`);
        dispatch({
            type: VENDOR_GET_BY_LIST,
            payload: response.data?.data, // Assuming response contains the customers data
        });
        return true;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const syncVendor = () => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/vendors/fetch');
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Vendors fetched and stored successfully!');
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


export const deleteVendor = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/vendors/delete/${id}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'vendors deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const onUpdateStatus = (id, status) => async (dispatch) => {
      try {
        const response = await axiosInstance.patch(`/users/status/${id}`, status);
        if (response) {
            toast.success(response.data.message);
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteAllItem = (ids) => async (dispatch) => {
    try {
        // Pass ids as the data property in the axios delete request
        const response = await axiosInstance.delete(`/vendors/delete/vendors/all`, {
            data: { ids }
        });

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'vendors deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};
