import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainMenu from '../screens/MainMenu'
import ToDoList from '../screens/ToDoList'
import MemoGame from '../screens/MemoGame'
import Weather from '../screens/Weather'

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

    return (
        <Stack.Navigator initialRouteName='AppsHome'>
            <Stack.Screen name='AppsHome' component={MainMenu} options={{ title: 'APPS | PLAYGROUND', headerShown: false }}/>
            <Stack.Screen name='ToDoList' component={ToDoList} options={{ title: 'TO DO LIST | PLAYGROUND' }}/>
            <Stack.Screen name='MemoGame' component={MemoGame} options={{ title: 'MEMO GAME | PLAYGROUND' }}/>
            <Stack.Screen name='Weather' component={Weather} options={{ title: 'WEATHER | PLAYGROUND' }}/>
        </Stack.Navigator>
    )
}

export default AppNavigator

