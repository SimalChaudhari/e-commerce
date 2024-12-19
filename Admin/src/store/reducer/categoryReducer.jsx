import { CATEGORY_LIST } from "../constants/actionTypes";

const initialState = {
    category: []
};
const categoryReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case CATEGORY_LIST:
            return {
                ...state,
                category: payload,
            };
        default:
            return state;
    }
};
export default categoryReducer;
