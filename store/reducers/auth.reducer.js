import { SIGN_UP } from "../actions/auth.action";

const initialState = {
   
}


const authReducer = (state=initialState, action) => {
    switch(action.type){
        case SIGN_UP:
            return {
                ...state,
                language: {...state.language, selected: action.lang}
            }
        default:
            return state
    }
}

export default authReducer