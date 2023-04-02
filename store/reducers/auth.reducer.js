import { SIGN_UP } from "../actions/auth.action";

const initialState = {
   token: null,
   userId: null,
}


const AuthReducer = (state=initialState, action) => {
    switch(action.type){
        case SIGN_UP:
            return {
               ...state,
               token: action.token,
               userId: action.userId
            }
        default:
            return state
    }
}

export default AuthReducer