import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import disableReducer from "./disableReducer";
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  disabled: disableReducer
});