import { StatusBar } from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from './TabNavigator';
import Constants from '../constants/Styles.js'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { getSettings, setSettings } from "../store/actions/settings.action";
import { getAppsData } from "../store/actions/apps.action";
import { refreshToken, getUserData } from '../store/actions/auth.action';
import { storageGetItem, storageSetItem } from "../utils/AsyncStorage";

const MainNavigator = () => {
    const dispatch = useDispatch();

    const userId = useSelector(state => state.auth.userId)
    const settings = useSelector(state => state.settings)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const id_token = useSelector(state => state.auth.token)
    const refresh_token = useSelector(state => state.auth.refreshToken)

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


    /* dispatchRefreshToken en caso de que la token haya expirado */
    const dispatchRefreshToken = () => {
        dispatch(refreshToken(refresh_token))
    }

    /* dispatch getUserData, si existe usuario. envio refresh por si la token ha expirado */
    useEffect(() => {
        (id_token || userId) && dispatch(getUserData(id_token, dispatchRefreshToken))
    }, [id_token])

    /* cuando se cambia user se trae data de apps/settings */
    useEffect(() => {
        dispatch(getAppsData(userId, storageGetItem));
        dispatch(getSettings(userId, storageGetItem));
    }, [userId])

    /* cambio settings instantaneamente y en el background se envian a firebase */
    useEffect(() => {
        dispatch(setSettings(settings, userId, storageSetItem))
    }, [settings])


    return (
        <NavigationContainer theme={MyTheme}>
            <StatusBar barStyle={"light-content"} hidden={false} backgroundColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} translucent={true} />
            <TabNavigator />
        </NavigationContainer>
    )
}

export default MainNavigator
