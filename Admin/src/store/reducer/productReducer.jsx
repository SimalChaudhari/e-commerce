import { PRODUCT_GET_BY_LIST, PRODUCT_LIST } from "../constants/actionTypes";

const initialState = {
    product: [],
    getByProduct: ''

};
const productReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case PRODUCT_LIST:
            return {
                ...state,
                product: payload,
            };
        case PRODUCT_GET_BY_LIST:
            return {
                ...state,
                getByProduct: payload,
            };
        default:
            return state;
    }
};

export default productReducer;
