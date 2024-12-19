import { useDispatch } from 'react-redux';
import { bannerList, deleteBanner } from 'src/store/action/settingActions';


export const useFetchBannerData = () => {
    const dispatch = useDispatch();

    const fetchBannerData = async () => {
        await dispatch(bannerList());
    };

    const fetchDeleteBannerData = async (id) => {

        try {
            const response = await dispatch(deleteBanner(id));;
            if (response) {
                fetchBannerData(); // Refetch banner data only on successful deletion
            }
        } catch (error) {
            console.error("Error deleting banner:", error);
        }
    };


    return { fetchBannerData, fetchDeleteBannerData };
};
