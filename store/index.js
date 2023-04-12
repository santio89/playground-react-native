
import { legacy_createStore as createStore, combineReducers, applyMiddleware } from "redux";
import SettingsReducer from './reducers/settings.reducer'
import AuthReducer from "./reducers/auth.reducer";
import AppsReducer from "./reducers/apps.reducer";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist"; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const RootReducer = combineReducers({
    settings: SettingsReducer,
    auth: AuthReducer,
    apps: AppsReducer
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ["settings", "auth"]
}

const PersistedReducer = persistReducer(persistConfig, RootReducer)

const store = createStore(PersistedReducer, applyMiddleware(thunk))


export default store