import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { SUB_CATEGORY_LIST } from "../constants/actionTypes";

export const subcategoryList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/subcategories');
        dispatch({
            type: SUB_CATEGORY_LIST,
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

export const createSubCategory = (subcategoryData) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/subcategories/create', subcategoryData);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'Category Created successfully!');
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

export const editSubCategory = (subcategoryId, subcategoryData) => async (dispatch) => {
    try {
        const response = await axiosInstance.put(`/subcategories/update/${subcategoryId}`, subcategoryData);

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'User updated successfully!');
            return true; // Indicate successful update
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteSubCategory = (subcategoryId) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/subcategories/delete/${subcategoryId}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'User deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};