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
        /* envio a firebase settings actuales como default del usuario */
        /* REVISAR QUE ACTUALIZE EL USUARIO */
        try {
            await fetch(`${URL_API}settings/${userId}.json`, {
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
        /* traigo de firebase settings actuales del usuario */
        try {
            const response = await fetch(`${URL_API}settings/${userId}.json`)
            const data = await response.json()

            /* dispatch seteando settings */
            dispatch({
                type: SET_SETTINGS,
                settings: data
            })
        } catch (e) {
            console.log("error getting settings: ", e)
        }
    }
}
