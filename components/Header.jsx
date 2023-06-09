import { Text, View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Keyboard, Platform } from 'react-native';
import Constants from '../constants/Styles';
import { useSelector } from 'react-redux';
import { Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Header({ navigation }) {
  const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
  const avatar = useSelector(state => state.auth.avatar)

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.headerContainer, altColorTheme && styles.altBackground, altColorTheme && styles.altBorder]}>
        <TouchableOpacity onPress={() => navigation.navigate("Apps", { screen: "AppsHome" })}><Text style={styles.header}>PLAYGROUND</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.loginContainer, altColorTheme && styles.altLoginContainer]} onPress={() => avatar ? navigation.navigate("Profile") : navigation.navigate("Auth", { screen: "LogIn" })}>
          <LinearGradient
            colors={altColorTheme ? [Constants.colorSecondaryDark, Constants.colorSecondary, Constants.colorSecondaryDark] : [Constants.colorPrimaryDark, Constants.colorPrimary, Constants.colorPrimaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4 }}
          />
          <View>
            {avatar ?
              <Text style={styles.avatar}>{avatar}</Text> :
              <Entypo name="login" size={Constants.fontLg} color={Constants.colorWhite} />}
          </View>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    backgroundColor: Constants.colorPrimary,
    padding: 10,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'web' ? 10 : 30,
    width: '100%',
    borderBottomColor: Constants.colorPrimaryDark,
    borderBottomWidth: 1,
    height: Platform.OS === 'web' ? 50 : 'auto',
  },
  header: {
    color: Constants.colorWhite,
    fontSize: Constants.fontLg,
    fontWeight: 'bold',
    fontFamily: Constants.fontPrimaryBold,
  },
  loginContainer: {
    backgroundColor: Constants.colorPrimaryDark,
    borderRadius: 4,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Constants.colorWhite,
    borderWidth: 1,
  },
  avatar: {
    color: Constants.colorWhite,
    fontFamily: Constants.fontPrimaryBold,
    fontSize: Constants.fontLg
  },
  /* for alt color theme */
  altLoginContainer: {
    backgroundColor: Constants.colorSecondaryDark,
  },
  altBackground: {
    backgroundColor: Constants.colorSecondary
  },
  altBorder: {
    borderBottomColor: Constants.colorSecondaryDark
  }
});
