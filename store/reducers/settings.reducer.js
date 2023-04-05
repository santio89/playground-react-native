import { SELECT_LANG, SELECT_DARKMODE, SELECT_COLORTHEME, SET_SETTINGS, GET_SETTINGS } from "../actions/settings.action";

const initialState = {
    language: {
        selected: "english"
    },
    darkMode: {
        enabled: true
    },
    altColorTheme: {
        enabled: false
    }
}


const settingsReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case SELECT_LANG:
            return {
                ...state,
                language: { ...state.language, selected: action.lang }
            }
        case SELECT_DARKMODE:
            return {
                ...state,
                darkMode: { ...state.darkMode, enabled: action.darkMode }
            }
        case SELECT_COLORTHEME:
            return {
                ...state,
                altColorTheme: { ...state.altColorTheme, enabled: action.altColorTheme }
            }
        case GET_SETTINGS:
            return state
        case SET_SETTINGS:
            return {
                ...state,
                language: {
                    selected: action.settings.language.selected
                },
                darkMode: {
                    enabled: action.settings.darkMode.enabled
                },
                altColorTheme: {
                    enabled: action.settings.altColorTheme.enabled
                }
            }
        default:
            return state
    }
}

export default settingsReducer