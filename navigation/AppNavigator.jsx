import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainMenu from '../screens/MainMenu'
import ToDoList from '../screens/ToDoList'
import MemoGame from '../screens/MemoGame'
import Weather from '../screens/Weather'
import Calculator from "../screens/Calculator";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

    return (
        <Stack.Navigator initialRouteName='AppsHome'>
            <Stack.Screen name='AppsHome' component={MainMenu} />
            <Stack.Screen name='ToDoList' component={ToDoList} />
            <Stack.Screen name='MemoGame' component={MemoGame} />
            <Stack.Screen name='Weather' component={Weather} />
            <Stack.Screen name='Calculator' component={Calculator} />
        </Stack.Navigator>
    )
}

export default AppNavigator

