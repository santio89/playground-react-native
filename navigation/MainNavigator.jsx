import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from './TabNavigator';
import Constants from '../constants/Styles.js'
import { useSelector } from 'react-redux';

const MainNavigator = () => {
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


    return (
        <NavigationContainer theme={MyTheme}>
            <TabNavigator />
        </NavigationContainer>
    )
}

export default MainNavigator
