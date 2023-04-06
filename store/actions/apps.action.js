export const SET_MEMO_SCORE = "SET_MEMO_SCORE"
export const SET_LIST_ITEMS = "SET_LIST_ITEMS"
export const GET_APPS_DATA = "GET_APPS_DATA"
import { URL_API } from "../../constants/Database"

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
            } catch {
                console.log("error setting memo score")
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
                console.log("error saving data to storage")
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
            } catch {
                console.log("error setting list items")
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
            } catch (error) {
                console.log("error saving data to storage")
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
                
                data && dispatch({
                    type: GET_APPS_DATA,
                    appsData: data
                })
            } catch {
                console.log("error getting apps data")
            }
        }
    } else {
        
        return async dispatch => {
            try {
                const valueList = await storageGetItem('pg-tdl-list');
                const valueMemo = await storageGetItem('pg-mg-score');

                valueList && !valueMemo && dispatch({
                    type: GET_APPS_DATA,
                    appsData: {
                        toDoList: {
                            items: JSON.parse(valueList)
                        },
                        memoGame: {
                            bestScore: "-"
                        }
                    }
                })
                valueMemo && !valueList && dispatch({
                    type: GET_APPS_DATA,
                    appsData: {
                        toDoList: {
                            items: []
                        },
                        memoGame: {
                            bestScore: JSON.parse(valueMemo)
                        }
                    }
                })
                valueList && valueMemo && dispatch({
                    type: GET_APPS_DATA,
                    appsData: {
                        toDoList: {
                            items: JSON.parse(valueList)
                        },
                        memoGame: {
                            bestScore: JSON.parse(valueMemo)
                        }
                    }
                })
            } catch (error) {
                console.log("error retrieving data from storage")
            }
        }
    }

}
