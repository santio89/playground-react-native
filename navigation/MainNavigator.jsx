import {StatusBar} from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from './TabNavigator';
import Constants from '../constants/Styles.js'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { getSettingsFirebase, setSettingsFirebase } from "../store/actions/settings.action";
import { getAppsData } from "../store/actions/apps.action";
import { storageGetItem } from "../utils/AsyncStorage";

const MainNavigator = () => {
    const dispatch = useDispatch();

    const userId = useSelector(state => state.auth.userId)
    const settings = useSelector(state => state.settings)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)


    const MyTheme = {
        dark: darkMode ? true : false,
        colors: {
            primary: altColorTheme ? Constants.colorSecondary : Constants.colorPrimary,
            background: darkMode ? Constants.colorDark : Constants.colorWhite,
            card: darkMode ? Constants.colorDark : Constants.colorWhite,
            text: altColorTheme ? Constants.colorSecondary : Constants.colorPrimary,
            border: 'transparent',
            notification: altColorTheme ? Constants.colorSecondary : Constants.colorPrimary,
        },
    };



    useEffect(() => {
        userId && dispatch(setSettingsFirebase(settings, userId))
    }, [settings])

    useEffect(() => {
        dispatch(getAppsData(userId, storageGetItem));
        userId && dispatch(getSettingsFirebase(userId));
    }, [userId])


    return (
        <NavigationContainer theme={MyTheme}>
            <StatusBar barStyle = {darkMode?"light-content":"dark-content"} hidden = {false} backgroundColor = {altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} translucent = {true}/>
            <TabNavigator />
        </NavigationContainer>
    )
}

export default MainNavigator
