export const SELECT_LANG = 'SELECT_LANG'
export const SELECT_DARKMODE = "SELECT_DARKMODE"
export const SELECT_COLORTHEME = "SELECT_COLORTHEME"

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