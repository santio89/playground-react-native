
import { createStore, combineReducers, applyMiddleware } from "redux";
import SettingsReducer from './reducers/settings.reducer'
import AuthReducer from "./reducers/auth.reducer";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'

const RootReducer = combineReducers({
    settings: SettingsReducer,
    auth: AuthReducer
})

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["settings", "auth"]
}

const PersistedReducer = persistReducer(persistConfig, RootReducer)

const store = createStore(PersistedReducer, applyMiddleware(thunk))


export default store