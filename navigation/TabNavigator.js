import { StyleSheet, Text, View } from 'react-native'
import AppNavigator from './AppNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Constants from '../constants/Styles.js'
import { Ionicons } from '@expo/vector-icons';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';

const BottomTabs = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <BottomTabs.Navigator initialRouteName='Apps' 
    screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle:styles.tabBar}}>
        <BottomTabs.Screen name='Apps' component={AppNavigator} 
        options={{
            tabBarIcon: ({focused}) => (
                <View style={[styles.item, focused && styles.itemFocused]}>
                    <Ionicons name="apps-sharp" size={Constants.fontLg} color={focused?Constants.colorWhite:Constants.colorDark} />
                    <Text>APPS</Text>
                </View>
            )
        }}/>
        <BottomTabs.Screen name='Profile' component={Profile} 
        options={{
            tabBarIcon: ({focused}) => (
                <View style={[styles.item, focused && styles.itemFocused]}>
                    <Ionicons name="person" size={Constants.fontLg} color={focused?Constants.colorWhite:Constants.colorDark} />
                    <Text>PERFIL</Text>
                </View>
            )
        }}/>
        <BottomTabs.Screen name='Settings' component={Settings} 
        options={{
            tabBarIcon: ({focused}) => (
                <View style={[styles.item, focused && styles.itemFocused]}>
                    <Ionicons name="settings" size={Constants.fontLg} color={focused?Constants.colorWhite:Constants.colorDark} />
                    <Text>CONFIG</Text>
                </View>
            )
        }}/>

    </BottomTabs.Navigator>
  )
}

export default TabNavigator

const styles = StyleSheet.create({
    tabBar: {
        color: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimaryDark,
        padding: 30
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: Constants.fontPrimary,
        color: Constants.colorDark
    },
    itemFocused: {
        color: Constants.colorWhite
    }
})