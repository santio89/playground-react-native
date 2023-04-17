import { StatusBar } from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from './TabNavigator';
import Constants from '../constants/Styles.js'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import { getSettingsFirebase, setSettingsFirebase } from "../store/actions/settings.action";
import { getAppsData } from "../store/actions/apps.action";
import { refreshToken, getUserData } from '../store/actions/auth.action';
import { storageGetItem } from "../utils/AsyncStorage";
import { useState } from 'react';

const MainNavigator = () => {
    const dispatch = useDispatch();

    const userId = useSelector(state => state.auth.userId)
    const settings = useSelector(state => state.settings)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const id_token = useSelector(state => state.auth.token)
    const refresh_token = useSelector(state => state.auth.refreshToken)
    const [firstToken, setFirstToken] = useState(true)

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

    
    /* al iniciar app se refresca token y se trae data de user (por si se actualizo) */
    useEffect(() => {
        userId && dispatch(refreshToken(refresh_token))
    }, [])

    /* cambio settings instantaneamente y en el background se envian a firebase */
    useEffect(() => {
        userId && dispatch(setSettingsFirebase(settings, userId))
    }, [settings])

    /* cuando se cambia user se trae data de apps/settings */
    useEffect(() => {
        dispatch(getAppsData(userId, storageGetItem));
        userId && dispatch(getSettingsFirebase(userId));
    }, [userId])

    /* la primer token va a ser desde el storage y posible expirada, entonces hago el dispatch con el siguiente token (del refresh) */
    useEffect(()=>{
        firstToken?setFirstToken(false):dispatch(getUserData(id_token))
    }, [id_token])

    return (
        <NavigationContainer theme={MyTheme}>
            <StatusBar barStyle={"light-content"} hidden={false} backgroundColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} translucent={true} />
            <TabNavigator />
        </NavigationContainer>
    )
}

export default MainNavigator
