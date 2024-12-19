import { useDispatch } from 'react-redux';
import { deleteFAQ, FAQList } from 'src/store/action/settingActions';


export const useFetchFAQData = () => {
    const dispatch = useDispatch();

    const fetchFAQData = async () => {
        await dispatch(FAQList());
    };

    const fetchDeleteFAQData = async (id) => {

        try {
            const response = await dispatch(deleteFAQ(id));;
            if (response) {
                fetchFAQData(); // Refetch product data only on successful deletion
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };


    return { fetchFAQData, fetchDeleteFAQData };
};
