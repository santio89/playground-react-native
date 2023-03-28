import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Constants from '../constants/Styles';

export default function Header() {

  return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>PLAYGROUND</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: Constants.colorPrimary,
    padding: 8,
    paddingTop: Platform.OS === 'web' ? 8 : 20,
    width: '100%',
    borderBottomColor: Constants.colorPrimaryDark,
    borderBottomWidth: 1,
  },
  header: {
    color: Constants.colorWhite,
    fontSize: Constants.fontLg,
    fontWeight: 'bold',
    fontFamily: Constants.fontPrimaryBold,
  },
});
