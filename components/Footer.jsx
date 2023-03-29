import { View, Text, StyleSheet, Linking } from 'react-native'
import Constants from '../constants/Styles'
import { useSelector } from 'react-redux'

export default function Footer() {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)

    return (
        <View style={[styles.footer, altColorTheme && styles.altBackground, altColorTheme && styles.altBorder]}>
            <Text style={styles.footerText} onPress={() => Linking.openURL('https://santiweb.netlify.app/')}>santiWeb</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    footer: {
        backgroundColor: Constants.colorPrimaryDark,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        textAlign: 'right',
        borderTopWidth: 1,
        borderColor: Constants.colorPrimary,
        paddingHorizontal: 8,
    },
    footerText: {
        color: Constants.colorWhite,
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontSm,
        padding: 4,
    },
    /* for alt color theme */
    altBackground: {
        backgroundColor: Constants.colorSecondaryDark
    },
    altBorder: {
        backgroundColor: Constants.colorSecondary
    }
})