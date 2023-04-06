import { SIGN_UP } from "../actions/auth.action";
import { LOG_IN } from "../actions/auth.action";
import { LOG_OUT } from "../actions/auth.action";

const initialState = {
   token: null,
   refreshToken: null,
   userId: null,
   email: "",
   displayName: "",
   avatar: "",
}


const AuthReducer = (state=initialState, action) => {
    
    switch(action.type){
        case SIGN_UP:
            return {
               ...state,
               token: action.token,
               refreshToken: action.refreshToken,
               userId: action.userId,
               displayName: action.displayName,
               avatar: action.avatar,
               email: action.email
            }
        case LOG_IN:
            return {
                ...state,
                token: action.token,
                refreshToken: action.refreshToken,
                userId: action.userId,
                displayName: action.displayName,
                avatar: action.avatar,
                email: action.email
            }
        case LOG_OUT:
            return {
                ...state,
                token: null,
                refreshToken: null,
                userId: null,
                displayName: "",
                email: "",
                avatar: ""
            }
        default:
            return state
    }
}

export default AuthReducer