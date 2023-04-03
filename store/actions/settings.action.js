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
            await fetch(URL_API + "settings.json", {
                method: 'POST',
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
export const getSettingsFirebase = () => {

    return async dispatch => {
        /* traigo de firebase settings actuales del usuario */
        try {
            const response = await fetch(URL_API + "settings.json")
            const data = response.json()

            console.log(data)

            /* dispatch seteando settings */
            dispatch({
                type: SET_SETTINGS,
                settings: data[0]
            })
        } catch (e) {
            console.log("error getting settings: ", e)
        }

    }
}
export const getSettingsLocal = (storageGetItem) => {

    return async dispatch => {
        /* traigo settings actuales del storage */
        try {
            const value = await storageGetItem('pg-settings');
            if (value !== null) {
                const settings = JSON.parse(value)
                dispatch({
                    type: SET_SETTINGS,
                    settings
                })

            }
        } catch (error) {
            console.log("error retrieving data from storage")
        }

    }
}
export const setSettingsLocal = (storageSetItem, settings) => {
    return async dispatch => {
        try {
            await storageSetItem("pg-settings", JSON.stringify(settings));
        } catch (error) {
            console.log("error saving data to storage")
        }
    }
}