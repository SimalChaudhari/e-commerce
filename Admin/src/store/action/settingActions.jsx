import { toast } from "sonner";
import axiosInstance from "src/configs/axiosInstance";
import {BANNER_GET_BY_LIST, BANNER_LIST, CONTACT_GET_BY_LIST, CONTACT_LIST, FAQ_GET_BY_LIST, FAQ_LIST, FETCH_TALLY_DATA, SYNC_GET_BY_LIST, SYNC_LIST, TERM_GET_BY_LIST, TERM_LIST, UPDATE_TALLY } from "../constants/actionTypes";

// FAQ Settings
export const FAQList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/faq');
        dispatch({
            type: FAQ_LIST,
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

export const FAQGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/faq/${id}`);
        dispatch({
            type: FAQ_GET_BY_LIST,
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

export const createFAQ = (faqData) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/faq/create', faqData);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'FAQ created successfully!');
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

export const editFAQ = (faqId, faqData) => async (dispatch) => {
    try {
        const response = await axiosInstance.put(`/faq/update/${faqId}`, faqData);

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'FAQ updated successfully!');
            return true; // Indicate successful update
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteFAQ = (faqId) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/faq/delete/${faqId}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'FAQ deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

// Contact Settings

export const contactList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/contact');
         dispatch({
            type: CONTACT_LIST,
            payload: response.data, // Assuming response contains the customers data
        });
        return response.data;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};



export const createContact = (contactData) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/contact', contactData);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'contact created successfully!');
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

//  Term & Conditions
export const termList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/terms-conditions');
         dispatch({
            type:TERM_LIST,
            payload: response.data, // Assuming response contains the customers data
        });
        return response.data;
    } catch (error) {
        // Check if error response exists and handle error message
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors
};

export const createTerm = (termData) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/terms-conditions',termData);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'terms-conditions created successfully!');
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

// Banner
export const bannerList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/banner/all');
         dispatch({
            type: BANNER_LIST,
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

export const bannerGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/banner/${id}`);
        console.log("🚀 ~ bannerGetByList ~ response:", response)
        dispatch({
            type: BANNER_GET_BY_LIST,
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

export const createBanner = (bannerData) => async (dispatch) => {
    try {
        const response = await axiosInstance.post('/banner/create', bannerData);
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'banner created successfully!');
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

export const editBanner = (bannerId, bannerData) => async (dispatch) => {
    try {
        const response = await axiosInstance.put(`/banner/update/${bannerId}`, bannerData);

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'banner updated successfully!');
            return true; // Indicate successful update
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteBanner = (bannerId) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/banner/delete/${bannerId}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'banner deleted successfully!');
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

// Syncs Data Settings

export const syncSettingList = () => async (dispatch) => {
    try {
        const response = await axiosInstance.get('/sync-control-settings/');
         dispatch({
            type: SYNC_LIST,
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

export const syncSettingGetByList = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.get(`/sync-control-settings/${id}`);

        dispatch({
            type: SYNC_GET_BY_LIST,
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

// export const createSyncSetting = (data) => async (dispatch) => {
//     try {
//         const response = await axiosInstance.post('/sync-control-settings', data);
//         if (response && response.status >= 200 && response.status < 300) {
//             toast.success(response.data.message || 'created successfully!');
//             return true;
//         }
//         return true;
//     } catch (error) {
//         // Check if error response exists and handle error message
//         const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
//         toast.error(errorMessage);
//     }
//     return false; // Return false for any errors
// };

export const editSyncSetting = (id, data) => async (dispatch) => {
    try {
        const response = await axiosInstance.put(`/sync-control-settings/${id}`, data);

        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message || 'updated successfully!');
            return true; // Indicate successful update
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};

export const deleteSyncSetting = (id) => async (dispatch) => {
    try {
        const response = await axiosInstance.delete(`/sync-control-settings/${id}`);
        // Check if the response is successful
        if (response && response.status >= 200 && response.status < 300) {
            toast.success(response.data.message );
            return true; // Indicate successful deletion
        }
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
};


// Tally Data 

export const fetchTallyAPIData = () => async (dispatch) => {
    try {
      const response = await axiosInstance.get('/tally-settings'); // Backend API endpoint
      dispatch({ type: FETCH_TALLY_DATA, payload: response.data });
      return true;
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempt
  };
  
  export const updateTallyAPI = (id,data) => async (dispatch) => {
    try {
      await axiosInstance.put(`/tally-settings/${id}`,data); // Backend API endpoint
      dispatch({ type: UPDATE_TALLY, payload: data });
      return true;
    } catch (error) {
        // Handle errors appropriately
        const errorMessage = error?.response?.data?.message || 'An unexpected error occurred. Please try again.';
        toast.error(errorMessage);
    }
    return false; // Return false for any errors or unsuccessful attempts
  };

  export const fetchTallyById = (id) => async (dispatch) => {
    try {
      const response = await axiosInstance.get(`/tally-settings/${id}`); // API call to get ledger by ID
      return response.data; // Return the fetched ledger details
    } catch (error) {
      console.error('Error fetching tally data by ID:', error);
      return null;
    }
  };
  