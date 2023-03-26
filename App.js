import { StyleSheet, SafeAreaView } from 'react-native'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react'
import Constants from './constants/Styles.js'
import MainNavigator from './navigation/MainNavigator.js'
import { Provider } from 'react-redux';
import store from './store/index'

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'golos-regular': require('./assets/fonts/GolosText-Regular.ttf'),
    'golos-bold': require('./assets/fonts/GolosText-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }



  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <MainNavigator />
      </SafeAreaView >
    </Provider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.colorDark,
    justifyContent: 'space-between',
    color: Constants.colorWhite,
    width: '100%',
  }
});