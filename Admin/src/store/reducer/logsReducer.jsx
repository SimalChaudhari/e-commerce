import { LOGS_LIST } from "../constants/actionTypes";

const initialState = {
   logs: [],
   
};
const logsReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case LOGS_LIST:
            return {
                ...state,
               logs: payload,
            };
        default:
            return state;
    }
};
export default logsReducer;
