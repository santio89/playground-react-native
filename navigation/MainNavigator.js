import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from './TabNavigator';
import Constants from '../constants/Styles.js'

const MainNavigator = () => {
    const MyTheme = {
        dark: true,
        colors: {
            primary: Constants.colorPrimary,
            background: Constants.colorDark,
            card: Constants.colorDark,
            text: Constants.colorPrimary,
            border: 'transparent',
            notification: Constants.colorPrimary,
        },
    };


    return (
        <NavigationContainer theme={MyTheme}>
            <TabNavigator />
        </NavigationContainer>
    )
}

export default MainNavigator

const styles = StyleSheet.create({})