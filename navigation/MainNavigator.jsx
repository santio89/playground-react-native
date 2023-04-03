import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from './TabNavigator';
import Constants from '../constants/Styles.js'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { getSettingsLocal, setSettingsLocal, getSettingsFirebase, setSettingsFirebase } from "../store/actions/settings.action";
import { storageGetItem, storageSetItem } from "../utils/AsyncStorage";

const MainNavigator = () => {
    const dispatch = useDispatch();

    const settings = useSelector(state=>state.settings)
    const userId = useSelector(state=>state.auth.userId)

    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    

    const MyTheme = {
        dark: darkMode?true:false,
        colors: {
            primary: altColorTheme?Constants.colorSecondary:Constants.colorPrimary,
            background: darkMode?Constants.colorDark:Constants.colorWhite,
            card: darkMode?Constants.colorDark:Constants.colorWhite,
            text: altColorTheme?Constants.colorSecondary:Constants.colorPrimary,
            border: 'transparent',
            notification: altColorTheme?Constants.colorSecondary:Constants.colorPrimary,
        },
    };


    useEffect(()=>{
        userId?dispatch(getSettingsFirebase):dispatch(getSettingsLocal(storageGetItem))
    }, [userId])
    
    useEffect(()=>{
        userId?dispatch(setSettingsFirebase(settings, userId)):dispatch(setSettingsLocal(storageSetItem, settings))
    }, [settings])



    return (
        <NavigationContainer theme={MyTheme}>
            <TabNavigator />
        </NavigationContainer>
    )
}

export default MainNavigator
