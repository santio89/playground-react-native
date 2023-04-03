
import { createStore, combineReducers, applyMiddleware } from "redux";
import SettingsReducer from './reducers/settings.reducer'
import AuthReducer from "./reducers/auth.reducer";
import thunk from "redux-thunk";
import { storageSetItem } from "../utils/AsyncStorage";

const RootReducer = combineReducers({
    settings: SettingsReducer,
    auth: AuthReducer
})

const store = createStore(RootReducer, applyMiddleware(thunk))



export default store