import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from './TabNavigator';
import Constants from '../constants/Styles.js'
import { useSelector } from 'react-redux';

const MainNavigator = () => {
    const darkMode = useSelector(state => state.settings.darkMode.enabled)

    const MyTheme = {
        dark: darkMode?true:false,
        colors: {
            primary: Constants.colorPrimary,
            background: darkMode?Constants.colorDark:Constants.colorWhite,
            card: darkMode?Constants.colorDark:Constants.colorWhite,
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
