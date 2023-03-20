import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainMenu from '../screens/MainMenu.js'
import ToDoList from '../screens/ToDoList.js'
import MemoGame from '../screens/MemoGame.js'

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

    return (
        <Stack.Navigator initialRouteName='Apps'>
            <Stack.Screen name='Apps' component={MainMenu} options={{ title: 'APPS', headerShown: false }}/>
            <Stack.Screen name='ToDoList' component={ToDoList} options={{ title: 'TO DO LIST' }}/>
            <Stack.Screen name='MemoGame' component={MemoGame} options={{ title: 'MEMO GAME' }}/>
        </Stack.Navigator>
    )
}

export default AppNavigator

