import { LEDGER_GET_BY_LIST, LEDGER_LIST, RECEIVABLE_GET_BY_LIST, RECEIVABLE_LIST } from "../constants/actionTypes";

const initialState = {
    receivable: [],
    getByReceivable: '',
    ledger: [],
    getByLedger: ''

};
const AccountingReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case RECEIVABLE_LIST:
            return {
                ...state,
                receivable: payload,
            };
        case RECEIVABLE_GET_BY_LIST:
            return {
                ...state,
                getByReceivable: payload,
            };

        case LEDGER_LIST:
            return {
                ...state,
                ledger: payload,
            };
        case LEDGER_GET_BY_LIST:
            return {
                ...state,
                getByLedger: payload,
            };

        default:
            return state;
    }
};

export default AccountingReducer;
