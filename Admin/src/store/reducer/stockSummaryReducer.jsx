import {  STOCK_LIST } from "../constants/actionTypes";

const initialState = {
    stock: [],
    getByStock: ''

};
const stockReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case STOCK_LIST:
            return {
                ...state,
                stock: payload,
            };
       
        default:
            return state;
    }
};

export default stockReducer;
