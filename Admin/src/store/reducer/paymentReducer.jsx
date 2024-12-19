import { PAYMENT_GET_BY_LIST, PAYMENT_LIST } from "../constants/actionTypes";

const initialState = {
    payment: [],
    getByPayment: ''

};
const paymentReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case PAYMENT_LIST:
            return {
                ...state,
                payment: payload,
            };
        case PAYMENT_GET_BY_LIST:
            return {
                ...state,
                getByPayment: payload,
            };
        default:
            return state;
    }
};

export default paymentReducer;
