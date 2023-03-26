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
                selected: state.langs.find(lang=>lang.id===action.langId)
            }
        default:
            return state
    }
}

export default langsReducer