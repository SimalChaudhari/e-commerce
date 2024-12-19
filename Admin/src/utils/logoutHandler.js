import { toast } from "sonner";

// src/utils/logoutHandler.js
const logoutHandler = () => {
    localStorage.removeItem('token'); // Remove token from storage
    // toast.error('Session expired. Please log in again.');
    window.location.href = '/login'; // Redirect to login page
  };
  
  export default logoutHandler;
  