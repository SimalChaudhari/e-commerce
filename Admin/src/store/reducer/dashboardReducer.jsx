import { DASHBOARD_LENGTH ,MONTHLY_ORDER_LIST} from "../constants/actionTypes";

const initialState = {
    dashboard: "",
    order_count: []
};
const dashboardReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case DASHBOARD_LENGTH:
            return {
                ...state,
                dashboard: payload,
            };

        case MONTHLY_ORDER_LIST:
            return {
                ...state,
                order_count: payload,
            };


        default:
            return state;
    }
};
export default dashboardReducer;