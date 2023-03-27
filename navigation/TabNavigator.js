import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AppNavigator from './AppNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Constants from '../constants/Styles.js'
import { Ionicons } from '@expo/vector-icons';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';

const BottomTabs = createBottomTabNavigator();

const TabNavigator = () => {
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    const updateWindowWidth = () => {
        setWindowWidth(Dimensions.get('window').width)
    }

    const { selected: languageSelected, langs } = useSelector(state => state.languages)

    const [text, setText] = useState(langs.find(lang => lang.lang === languageSelected).text)

    useEffect(() => {
        const dimensionsHandler = Dimensions.addEventListener("change", updateWindowWidth)

        return () => {
            dimensionsHandler.remove()
        }
    })

    useEffect(() => {
        setText(langs.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

    return (
        <BottomTabs.Navigator initialRouteName='Apps'
            screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: styles.tabBar }}>
            <BottomTabs.Screen name='Apps' component={AppNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.item, focused && styles.itemFocused]}>
                            <Ionicons name="apps-sharp" size={Constants.fontLg} color={focused ? Constants.colorWhite : Constants.colorDark} />
                            <Text style={[styles.itemText, focused && styles.itemTextFocused, windowWidth <= 800 && styles.itemTextMobile]}>APPS</Text>
                        </View>
                    ),
                    title: 'APPS | PLAYGROUND'
                }} />
            <BottomTabs.Screen name='Profile' component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.item, focused && styles.itemFocused]}>
                            <Ionicons name="person" size={Constants.fontLg} color={focused ? Constants.colorWhite : Constants.colorDark} />
                            <Text style={[styles.itemText, focused && styles.itemTextFocused, windowWidth <= 800 && styles.itemTextMobile]}>{text.profile}</Text>
                        </View>
                    ),
                    title: 'PROFILE | PLAYGROUND'
                }} />
            <BottomTabs.Screen name='Settings' component={Settings}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.item, focused && styles.itemFocused]}>
                            <Ionicons name="settings" size={Constants.fontLg} color={focused ? Constants.colorWhite : Constants.colorDark} />
                            <Text style={[styles.itemText, focused && styles.itemTextFocused, windowWidth <= 800 && styles.itemTextMobile]}>CONFIG</Text>
                        </View>
                    ),
                    title: 'CONFIG | PLAYGROUND'
                }} />

        </BottomTabs.Navigator>
    )
}

export default TabNavigator

const styles = StyleSheet.create({
    tabBar: {
        color: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimaryDark,
        height: 60,
        borderTopColor: Constants.colorPrimary,
        borderTopWidth: 1,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: Constants.fontPrimary,
        color: Constants.colorDark
    },
    itemFocused: {
        color: Constants.colorWhite
    },
    itemText: {
        color: Constants.colorDark,
        fontSize: 16,
    },
    itemTextFocused: {
        color: Constants.colorWhite,
    },
    itemTextMobile: {
        fontSize: 12
    }
})