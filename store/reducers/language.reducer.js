import { LANGS } from "../../data/lang/langs";
import { SELECT_LANG } from "../actions/language.action";

const initialState = {
    langs: LANGS,
    selected: "english"
}

const langsReducer = (state=initialState, action) => {
    switch(action.type){
        case SELECT_LANG:
            return {
                ...state,
                selected: action.lang
            }
        default:
            return state
    }
}

export default langsReducer