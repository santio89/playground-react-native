import { SIGN_UP, LOG_IN, LOG_OUT, REFRESH_TOKEN, UPDATE_USERNAME, UPDATE_AVATAR, GET_USER_DATA  } from "../actions/auth.action";

const initialState = {
    token: null,
    refreshToken: null,
    userId: null,
    email: "",
    displayName: "",
    avatar: "",
}


const AuthReducer = (state = initialState, action) => {

    switch (action.type) {
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
        case REFRESH_TOKEN:
            return {
                ...state,
                token: action.token,
                refreshToken: action.refreshToken,
            }
        case GET_USER_DATA: 
            return {
                ...state,
                ...action
            }
        case UPDATE_USERNAME: 
            return {
                ...state,
                displayName: action.displayName
            }
        case UPDATE_AVATAR:
            return {
                ...state,
                avatar: action.avatar
            }
        default:
            return state
    }
}

export default AuthReducer