export const SELECT_LANG = 'SELECT_LANG'
export const SELECT_DARKMODE = "SELECT_DARKMODE"
export const SELECT_COLORTHEME = "SELECT_COLORTHEME"
export const SET_SETTINGS = "SEND_SETTINGS"
export const GET_SETTINGS = "GET_SETTINGS"
import { URL_API } from "../../constants/Database"

export const selectLang = (lang) => ({
    type: SELECT_LANG,
    lang
})

export const selectDarkMode = (darkMode) => ({
    type: SELECT_DARKMODE,
    darkMode
})

export const selectColorTheme = (altColorTheme) => ({
    type: SELECT_COLORTHEME,
    altColorTheme
})

export const setSettingsFirebase = (settings, userId) => {

    return async dispatch => {
        
        try {
            await fetch(`${URL_API}settings/${userId}.json?auth=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...settings,
                    userId
                })
            })
        } catch (e) {
            console.log("error setting settings: ", e)
        }

        dispatch({
            type: GET_SETTINGS,
        })
    }
}

export const getSettingsFirebase = (userId) => {

    return async dispatch => {
        
        try {
            const response = await fetch(`${URL_API}settings/${userId}.json?auth=${userId}`)
            const data = await response.json()
            
            
            data && dispatch({
                type: SET_SETTINGS,
                settings: data
            })
        } catch (e) {
            console.log("error getting settings: ", e)
        }
    }
}
