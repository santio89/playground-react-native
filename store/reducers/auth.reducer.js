import { SIGN_UP } from "../actions/auth.action";
import { LOG_IN } from "../actions/auth.action";

const initialState = {
   token: null,
   userId: null,
   displayName: ""
}


const AuthReducer = (state=initialState, action) => {
    switch(action.type){
        case SIGN_UP:
            return {
               ...state,
               token: action.token,
               userId: action.userId,
               displayName: action.displayName
            }
        case LOG_IN:
            return {
                ...state,
                token: action.token,
                userId: action.userId,
                displayName: action.displayName
            }
        default:
            return state
    }
}

export default AuthReducer