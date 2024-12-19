import { ORDER_LIST, ORDER_BY_LIST } from "../constants/actionTypes";

const initialState = {
    order: [],
    orderByID: ""

};
const orderReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case ORDER_LIST:
            return {
                ...state,
                order: payload,
            };
        case ORDER_BY_LIST:
            return {
                ...state,
                orderByID: payload,
            };
        default:
            return state;
    }
};
export default orderReducer;