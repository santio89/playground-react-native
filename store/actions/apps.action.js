import { URL_API } from "../../constants/Database"

export const SET_MEMO_SCORE = "SET_MEMO_SCORE"
export const SET_LIST_ITEMS = "SET_LIST_ITEMS"
export const SET_ALBUM_ITEMS = "SET_ALBUM_ITEMS"
export const GET_APPS_DATA = "GET_APPS_DATA"
export const LOG_OUT_APPS = "LOG_OUT_APPS"

export const setMemoScore = (userId, bestScore, storageSetItem) => {
    if (userId) {
        return async dispatch => {
            try {
                await fetch(`${URL_API}apps/${userId}.json?auth=${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        memoGame: {
                            bestScore: bestScore
                        }
                    })
                })

                dispatch({
                    type: SET_MEMO_SCORE,
                    bestScore
                })
            } catch (e) {
                console.log("error setting memo score: ", e)
            }
        }
    } else {
        return async dispatch => {
            try {
                await storageSetItem("pg-mg-score", JSON.stringify(bestScore));

                dispatch({
                    type: SET_MEMO_SCORE,
                    bestScore
                })
            } catch (error) {
                console.log("error saving data to storage: ", error)
            }
        }
    }
}

export const setListItems = (userId, items, storageSetItem) => {
    if (userId) {
        return async dispatch => {
            try {
                await fetch(`${URL_API}apps/${userId}.json?auth=${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        toDoList: {
                            items
                        },
                    })
                })

                dispatch({
                    type: SET_LIST_ITEMS,
                    items
                })
            } catch (e) {
                console.log("error setting list items: ", e)
            }
        }
    } else {
        return async dispatch => {
            try {
                await storageSetItem("pg-tdl-list", JSON.stringify(items));

                dispatch({
                    type: SET_LIST_ITEMS,
                    items
                })
            } catch (e) {
                console.log("error saving data to storage: ", e)
            }
        }
    }

}

export const setAlbumItems = (userId, items, storageSetItem) => {
    if (userId) {
        return async dispatch => {
            try {
                await fetch(`${URL_API}apps/${userId}.json?auth=${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        albumList: {
                            items
                        },
                    })
                })

                dispatch({
                    type: SET_ALBUM_ITEMS,
                    items
                })
            } catch (e) {
                console.log("error setting album items: ", e)
            }
        }
    } else {
        return async dispatch => {
            try {
                await storageSetItem("pg-tdl-album", JSON.stringify(items));

                dispatch({
                    type: SET_ALBUM_ITEMS,
                    items
                })
            } catch (e) {
                console.log("error saving data to storage: ", e)
            }
        }
    }
}

export const getAppsData = (userId, storageGetItem) => {

    if (userId) {
        return async dispatch => {
            try {
                const response = await fetch(`${URL_API}apps/${userId}.json?auth=${userId}`)

                const data = await response.json()

                if (data && !data.toDoList) {
                    data.toDoList = { 'items': [] }
                }
                if (data && !data.albumList) {
                    data.albumList = { 'items': [] }
                }
                data && dispatch({
                    type: GET_APPS_DATA,
                    appsData: data
                })
            } catch (e) {
                console.log("appsDataException-", e)
            }
        }
    } else {

        return async dispatch => {
            try {
                const valueList = await storageGetItem('pg-tdl-list')
                const valueMemo = await storageGetItem('pg-mg-score')
                const valueAlbum = await storageGetItem('pg-tdl-album')

                valueList && dispatch({
                    type: SET_LIST_ITEMS,
                    items: JSON.parse(valueList)
                })
                valueMemo && dispatch({
                    type: SET_MEMO_SCORE,
                    bestScore: JSON.parse(valueMemo)
                })
                valueAlbum && dispatch({
                    type: SET_ALBUM_ITEMS,
                    items: JSON.parse(valueAlbum)
                })
            } catch (e) {
                console.log("error retrieving data from storage: ", e)
            }
        }
    }

}

export const logOutApps = ()=>{
    return dispatch => {
        dispatch({ type: LOG_OUT_APPS })
    }
}
