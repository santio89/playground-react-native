import { SET_MEMO_SCORE, SET_LIST_ITEMS, SET_ALBUM_ITEMS, GET_APPS_DATA } from "../actions/apps.action";

const initialState = {
    toDoList: {
        items: []
    },
    memoGame: {
        bestScore: "-"
    },
    albumList: {
        items: []
    }
}

const AppsReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_MEMO_SCORE:
            return {
                ...state,
                memoGame: {
                    bestScore: action.bestScore
                }
            }
        case SET_LIST_ITEMS:
            return {
                ...state,
                toDoList: {
                    items: action.items
                }
            }
        case SET_ALBUM_ITEMS:
            return {
                ...state,
                albumList: {
                    items: action.items
                }
            }
        case GET_APPS_DATA:
            return {
                ...state,
                toDoList: {
                    items: action.appsData.toDoList.items
                },
                memoGame: {
                    bestScore: action.appsData.memoGame.bestScore
                },
                albumList: {
                    items: action.appsData.albumList.items
                }
            }
        default:
            return state
    }
}

export default AppsReducer