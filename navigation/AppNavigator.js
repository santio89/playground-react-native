import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Constants from '../constants/Styles.js'
import MainMenu from '../screens/MainMenu.js'
import ToDoList from '../screens/ToDoList.js'
import MemoGame from '../screens/MemoGame.js'

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
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
            <Stack.Navigator initialRouteName='MENU'>
                <Stack.Screen name='MENU' component={MainMenu} />
                <Stack.Screen name='ToDoList' component={ToDoList} />
                <Stack.Screen name='MemoGame' component={MemoGame} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator

