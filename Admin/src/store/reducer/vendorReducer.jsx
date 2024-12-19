import { VENDOR_GET_BY_LIST, VENDOR_LIST } from "../constants/actionTypes";

const initialState = {
    vendor: [],
    getByVendor: ''

};
const vendorReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case VENDOR_LIST:
            return {
                ...state,
                vendor: payload,
            };
        case VENDOR_GET_BY_LIST:
            return {
                ...state,
                getByVendor: payload,
            };
        default:
            return state;
    }
};

export default vendorReducer;
