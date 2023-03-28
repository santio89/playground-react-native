import { Text, View, StyleSheet, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Constants from '../constants/Styles';
import { useSelector } from 'react-redux';

export default function Header() {
  const darkMode = useSelector(state => state.settings.darkMode.enabled)

  return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View style={[styles.headerContainer, !darkMode && styles.borderDark]}>
        <Text style={[styles.header]}>PLAYGROUND</Text>
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
    borderBottomColor: Constants.colorWhite,
    borderBottomWidth: 1,
  },
  header: {
    color: Constants.colorWhite,
    fontSize: Constants.fontLg,
    fontWeight: 'bold',
    fontFamily: Constants.fontPrimaryBold,
  },
  /* for dark mode off */
  borderDark: {
    borderBottomColor: Constants.colorDark,
  },
});
