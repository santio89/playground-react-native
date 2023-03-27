import { LANGS } from "../../data/lang/langs";
import { SELECT_LANG } from "../actions/language.action";
import { storageGetItem } from '../../utils/AsyncStorage.js';

const initialState = {
    langs: LANGS,
    selected: "english"
}

const retrieveData = async () => {
    try {
        const value = await storageGetItem('pg-config');
        if (value !== null) {
            initialState.selected = JSON.parse(value).lang
        }
    } catch (error) {
        console.log("error retrieving data from storage")
    }
}
retrieveData()

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