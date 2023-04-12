import { StyleSheet, SafeAreaView } from 'react-native'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react'
import Constants from './constants/Styles.js'
import MainNavigator from './navigation/MainNavigator.jsx'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {store, persistor} from './store/index.js'

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
      <PersistGate persistor={persistor} loading={null}>
        <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
          <MainNavigator />
        </SafeAreaView >
      </PersistGate>
    </Provider >
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