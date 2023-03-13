import React from 'react'
import { View, Text, StyleSheet, Linking } from 'react-native'
import Constants from '../constants/Styles'

export default function Footer() {
    return (
        <View style={styles.footer}>
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
        padding: 8,
    }
})