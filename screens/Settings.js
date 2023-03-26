import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Constants from '../constants/Styles.js'
import Header from '../components/Header.js'

const Settings = () => {

    const dispatch = useDispatch()

    const languageSelected = useSelector(state=>state.languages.selected)
    const langs = useSelector(state=>state.languages.langs)

    const [text, setText] = useState(langs.find(lang=>lang.lang === languageSelected).text)

    
    /* estado de prueba */
    const [userSettings, setUserSettings] = useState({
        idioma: text.spanish,
        darkMode: true,
        colorTheme: text.purple
    })

    useEffect(()=>{
        setText(langs.find(lang=>lang.lang === languageSelected).text)
    }, [languageSelected])


    return (
        <>
            <Header />
            <ScrollView contentContainerStyle={styles.settingsContainer}>
                <View style={styles.itemsContainer}>
                    <View style={styles.settingsItem}>
                        <Text style={styles.settingsItemLabel}><Text style={styles.settingsItemIndicator}>●&nbsp;</Text><Text>{text.language}: </Text></Text>
                        <Text style={styles.settingsItemText}>{userSettings.idioma}</Text>
                    </View>
                    <View style={styles.settingsItem}>
                        <Text style={styles.settingsItemLabel}><Text style={styles.settingsItemIndicator}>●&nbsp;</Text><Text>{text.darkMode}: </Text></Text>
                        <Text style={styles.settingsItemText}>{userSettings.darkMode ? text.enabled : text.disabled}</Text>
                    </View>
                    <View style={styles.settingsItem}>
                        <Text style={styles.settingsItemLabel}><Text style={styles.settingsItemIndicator}>●&nbsp;</Text><Text>{text.colorTheme}: </Text></Text>
                        <Text style={styles.settingsItemText}>{userSettings.colorTheme}</Text>
                    </View>
                </View>
            </ScrollView>
        </>
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
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
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