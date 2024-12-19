import { useDispatch } from 'react-redux';
import { deletePayment, paymentList } from 'src/store/action/paymentActions';

export const useFetchData = () => {
    const dispatch = useDispatch();

    const fetchData = async () => {
        await dispatch(paymentList());
    };

    const fetchDeleteData = async (id) => {

        try {
            const response = await dispatch(deletePayment(id));;
            if (response) {
                fetchData(); // Refetch banner data only on successful deletion
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };


    return { fetchData, fetchDeleteData };
};
