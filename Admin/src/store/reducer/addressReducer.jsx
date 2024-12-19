import { ADDRESS_LIST, ADDRESS_BY_LIST } from "../constants/actionTypes";

const initialState = {
    address: [],
    addressByID: ""
};
const addressReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case ADDRESS_LIST:
            return {
                ...state,
                address: payload,
            };

        case ADDRESS_BY_LIST:
            return {
                ...state,
                addressByID: payload,
            };


        default:
            return state;
    }
};
export default addressReducer;
