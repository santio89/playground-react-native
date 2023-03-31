import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogIn from '../screens/LogIn'
import SignUp from '../screens/SignUp'

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='LogIn'>
            <Stack.Screen name='LogIn' component={LogIn} options={{ title: 'LOG IN | PLAYGROUND', headerShown: false }}/>
            <Stack.Screen name='SignUp' component={SignUp} options={{ title: 'SIGN UP | PLAYGROUND', headerShown: false }}/>
        </Stack.Navigator>
    )
}

export default AuthNavigator

