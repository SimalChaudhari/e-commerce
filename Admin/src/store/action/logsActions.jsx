import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import { LOGS_LIST } from "../constants/actionTypes";

export const logsList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/sync-log');
         dispatch({
            type: LOGS_LIST,
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
