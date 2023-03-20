import { StyleSheet, Text, View, ScrollView } from 'react-native'
import Constants from '../constants/Styles.js'
import { useState } from 'react'

const Settings = () => {
    /* estado de prueba */
    const [userSettings, setUserSettings] = useState({
        idioma: "Español",
        darkMode: true,
        colorTheme: 'Púrpura'
    })

    return (
        <ScrollView contentContainerStyle={styles.settingsContainer}>
            <View style={styles.itemsContainer}>
                <View style={styles.settingsItem}>
                    <Text style={styles.settingsItemLabel}><Text style={styles.settingsItemIndicator}>●&nbsp;</Text><Text>Idioma: </Text></Text>
                    <Text style={styles.settingsItemText}>{userSettings.idioma}</Text>
                </View>
                <View style={styles.settingsItem}>
                    <Text style={styles.settingsItemLabel}><Text style={styles.settingsItemIndicator}>●&nbsp;</Text><Text>Modo Oscuro: </Text></Text>
                    <Text style={styles.settingsItemText}>{userSettings.darkMode?"Activado":"Desactivado"}</Text>
                </View>
                <View style={styles.settingsItem}>
                    <Text style={styles.settingsItemLabel}><Text style={styles.settingsItemIndicator}>●&nbsp;</Text><Text>Tema de Color: </Text></Text>
                    <Text style={styles.settingsItemText}>{userSettings.colorTheme}</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default Settings

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        backgroundColor: Constants.colorDark,
        justifyContent: 'center',
        alignItems: 'center',
        color: Constants.colorWhite,
        width: '100%',
        padding: 10
    },
    itemsContainer: {
        width: '100%',
        minWidth: 300,
        maxWidth: 800,
        padding: 20,
        paddingBottom: 10,
        backgroundColor: Constants.colorPrimary,
        borderRadius: 8,
        borderWidth: 4,
        borderColor: Constants.colorPrimaryDark,
    },
    settingsItemIndicator: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorPrimaryDark
    },
    settingsItem: {
        marginBottom: 20,
        justifyContent: 'start',
        alignItems: 'start'
    },
    settingsItemLabel: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    settingsItemText: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorDark
    }
})