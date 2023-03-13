import { StyleSheet, SafeAreaView } from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Constants from '../constants/Styles.js'
import MainMenu from '../screens/MainMenu.js'
import ToDoList from '../screens/ToDoList.js'
import MemoGame from '../screens/MemoGame.js'
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <NavigationContainer>
                <Stack.Navigator initialRouteName='Menu'>
                    <Stack.Screen name='Menu' component={MainMenu} />
                    <Stack.Screen name='ToDoList' component={ToDoList} />
                    <Stack.Screen name='MemoGame' component={MemoGame} />
                </Stack.Navigator>
            </NavigationContainer>
            <Footer />
        </SafeAreaView >
    )
}

export default AppNavigator


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.colorDark,
        justifyContent: 'space-between',
        color: Constants.colorWhite,
        width: '100%'
    }
});
