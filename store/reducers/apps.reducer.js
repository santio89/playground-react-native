import { SET_MEMO_SCORE, SET_LIST_ITEMS, SET_ALBUM_ITEMS, GET_APPS_DATA, SET_LOADING } from "../actions/apps.action";

const initialState = {
    toDoList: {
        items: []
    },
    memoGame: {
        bestScore: "-"
    },
    albumList: {
        items: []
    },
    isLoading: false
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
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        default:
            return state
    }
}

export default AppsReducer