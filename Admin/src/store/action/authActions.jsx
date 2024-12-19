
import { AUTH_DATA } from "../constants/actionTypes";
import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import CryptoJS from 'crypto-js';

const secretKey = 'your-secret-key'; // Define a secret key for encryption

export const sendOtp = (contact) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('auth/verify-otp', contact);
        if (response) {
            toast.success(response.data.message)
        }
        return true;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const validateOtp = (contact, otp) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('auth/login', { contact, otp });
        const token = response?.data?.access_token;
        // const encryptedToken = CryptoJS.AES.encrypt(token, secretKey).toString();
        // const encryptedTokenName = CryptoJS.AES.encrypt('token', secretKey).toString();
        // const decryptedBytes = CryptoJS.AES.decrypt(encryptedTokenName, secretKey);
        // const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);
        localStorage.setItem('userData', JSON.stringify({ user: response?.data?.user }));
        localStorage.setItem('token', token); // Store encrypted name and value
        // Dispatch the authentication action
        dispatch({
            type: AUTH_DATA,
            payload: { user: response?.data?.user },
        });

        if (response) {
            toast.success(response.data.message)
        }
        return { success: true, user: response?.data?.user };

    } catch (error) {
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false;
};

export const logout = () => async (dispatch) => {
    try {
        // Clear local storage
        localStorage.removeItem("userData");
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
     
        toast.success("Logged out successfully!");
        return true;
    } catch (error) {
        console.error("Error logging out:", error);
        return false;
    }
};





