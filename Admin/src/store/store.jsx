import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Correctly import `thunk`
import { composeWithDevTools } from 'redux-devtools-extension'; // Import Redux DevTools
import userReducer from './reducer/userReducer';
import authReducer from './reducer/authReducer';
import addressReducer from './reducer/addressReducer';
import categoryReducer from './reducer/categoryReducer';
import subcategoryReducer from './reducer/subcategoryReducer';
import productReducer from './reducer/productReducer';
import settingReducer from './reducer/settingReducer';
import vendorReducer from './reducer/vendorReducer';
import cartReducer from './reducer/cartReducer';
import orderReducer from './reducer/orderReducer';
import dashboardReducer from './reducer/dashboardReducer';
import stockReducer from './reducer/stockSummaryReducer';
import AccountingReducer from './reducer/accountingReducer';
import logsReducer from './reducer/logsReducer';
import paymentReducer from './reducer/paymentReducer';

// Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  address: addressReducer,
  category: categoryReducer,
  subcategory: subcategoryReducer,
  product: productReducer,
  setting: settingReducer,
  vendor: vendorReducer,
  cart: cartReducer,
  order: orderReducer,
  dash: dashboardReducer,
  stock : stockReducer,
  accounting : AccountingReducer,
  logs : logsReducer,
  payment : paymentReducer






});

// Create the Redux store with the combined reducer, middleware, and Redux DevTools
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk)) // Integrate DevTools with thunk middleware
);

export default store;
