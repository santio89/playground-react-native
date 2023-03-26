
import { createStore, combineReducers, applyMiddleware } from "redux";
import LangReducer from './reducers/language.reducer'
import thunk from "redux-thunk";

const RootReducer = combineReducers({
    languages: LangReducer
})

export default createStore(RootReducer, applyMiddleware(thunk))