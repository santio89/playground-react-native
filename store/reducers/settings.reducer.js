import { LANGS } from "../../data/lang/langs";
import { SELECT_LANG, SELECT_DARKMODE, SELECT_COLORTHEME } from "../actions/settings.action";
import { storageGetItem } from '../../utils/AsyncStorage.js';

const initialState = {
    language: {
        langs: LANGS,
        selected: "english"
    },
    darkMode: {
        enabled: true
    },
    altColorTheme: {
        enabled: false
    }
}

const retrieveData = async () => {
    try {
        const value = await storageGetItem('pg-settings');
        if (value !== null) {
            const data = JSON.parse(value)
            initialState.language.selected = data?.lang
            initialState.darkMode.enabled = data?.darkMode
            initialState.altColorTheme.enabled = data?.altColorTheme
        }
    } catch (error) {
        console.log("error retrieving data from storage")
    }
}
retrieveData()


const settingsReducer = (state=initialState, action) => {
    switch(action.type){
        case SELECT_LANG:
            return {
                ...state,
                language: {...state.language, selected: action.lang}
            }
        case SELECT_DARKMODE:
            return {
                ...state,
                darkMode: {...state.darkMode, enabled: action.darkMode}
            }
        case SELECT_COLORTHEME:
            return {
                ...state,
                altColorTheme: {...state.altColorTheme, enabled: action.altColorTheme}
            }
        default:
            return state
    }
}

export default settingsReducer