import { CART_LIST } from "../constants/actionTypes";

const initialState = {
    cart: []
};
const cartReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case CART_LIST:
            return {
                ...state,
                cart: payload,
            };
        default:
            return state;
    }
};
export default cartReducer;
