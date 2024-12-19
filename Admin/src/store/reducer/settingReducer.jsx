import { SYNC_GET_BY_LIST, SYNC_LIST, FAQ_LIST, FAQ_GET_BY_LIST, CONTACT_GET_BY_LIST, CONTACT_LIST, TERM_LIST, TERM_GET_BY_LIST, BANNER_LIST, BANNER_GET_BY_LIST, FETCH_TALLY_DATA, UPDATE_TALLY } from "../constants/actionTypes";

const initialState = {
    faq: [],
    contact: [],
    termCondition: [],
    getByFAQ: '',
    getByContact: '',
    getByTermCondition: '',
    banner: [],
    getByBanner: '',
    syncData: [],
    getBySyncData: '',
    tallyFetchData: [],

};
const settingReducer = (state = initialState, { type, payload } = {}) => {
    switch (type) {

        case SYNC_LIST:
            return {
                ...state,
                syncData: payload,
            };

        case SYNC_GET_BY_LIST:
            return {
                ...state,
                getBySyncData: payload,
            };

        case FAQ_LIST:
            return {
                ...state,
                faq: payload,
            };
        case FAQ_GET_BY_LIST:
            return {
                ...state,
                getByFAQ: payload,
            };

        case CONTACT_LIST:
            return {
                ...state,
                contact: payload,
            };
        case CONTACT_GET_BY_LIST:
            return {
                ...state,
                getByContact: payload,
            };

        case TERM_LIST:
            return {
                ...state,
                termCondition: payload,
            };
        case TERM_GET_BY_LIST:
            return {
                ...state,
                getByTermCondition: payload,
            };

        case BANNER_LIST:
            return {
                ...state,
                banner: payload,
            };

        case BANNER_GET_BY_LIST:
            return {
                ...state,
                getByBanner: payload,
            };

            case FETCH_TALLY_DATA:
            return {
              ...state,
              tallyFetchData: payload,
            };

            case UPDATE_TALLY:
            return {
                ...state,
                tallyFetchData: state.tallyFetchData.map((ledger) =>
                    ledger.id === payload.id ? payload : ledger
                ),
            };
        

        default:
            return state;
    }
};

export default settingReducer;
