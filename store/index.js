
import { createStore, combineReducers, applyMiddleware } from "redux";
import SettingsReducer from './reducers/settings.reducer'
import thunk from "redux-thunk";
import { storageSetItem } from "../utils/AsyncStorage";

const RootReducer = combineReducers({
    settings: SettingsReducer
})

const store = createStore(RootReducer, applyMiddleware(thunk))


const storeData = async (data) => {
    try {
        await storageSetItem("pg-settings", JSON.stringify(data));
    } catch (error) {
        console.log("error saving data to storage")
    }
};

store.subscribe(()=>{
    const state = store.getState();
    storeData({
        lang: state.settings.language.selected, 
        darkMode: state.settings.darkMode.enabled, 
        altColorTheme: state.settings.altColorTheme.enabled
    });
            
})

export default store