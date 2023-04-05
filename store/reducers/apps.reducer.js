import { SET_MEMO_SCORE, SET_LIST_ITEMS, GET_MEMO_SCORE, GET_LIST_ITEMS } from "../actions/apps.action";

const initialState = {
    toDoList: {
        items: []
    },
    memoGame: {
        bestScore: "-"
    }
}

const appsReducer = (state = initialState, action) => {
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
                    items: [action.item, ...state.toDoList.items]
                }
            }
        case GET_MEMO_SCORE:
            return {
                ...state,
                memoGame: {
                    bestScore: action.bestScore
                }
            }
        case GET_LIST_ITEMS:
            return {
                ...state,
                toDoList: {
                    items: action.items
                }
            }
    }
}