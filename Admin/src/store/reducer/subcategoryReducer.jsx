import { SUB_CATEGORY_LIST } from "../constants/actionTypes";

const initialState = {
    subcategory: []
};
const subcategoryReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case SUB_CATEGORY_LIST:
            return {
                ...state,
                subcategory: payload,
            };
        default:
            return state;
    }
};

export default subcategoryReducer;
