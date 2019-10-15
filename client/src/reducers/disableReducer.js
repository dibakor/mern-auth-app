import {
    UNSET_DISABLED_FLAG,
    SET_DISABLED_FLAG
  } from "../actions/types";
  const initialState = {
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case UNSET_DISABLED_FLAG:
        return{
          ...state,
          disabled:false
        }
      case SET_DISABLED_FLAG:
            return{
              ...state,
              disabled:true
            }
      default:
        return state;
    }
  }