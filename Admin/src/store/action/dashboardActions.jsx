import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { DASHBOARD_LENGTH, MONTHLY_ORDER_LIST } from "../constants/actionTypes";

export const dashboardList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/dashboard/data');
        dispatch({
            type: DASHBOARD_LENGTH,
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


export const dashOrderList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/order/get/monthly');
        dispatch({
            type: MONTHLY_ORDER_LIST,
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