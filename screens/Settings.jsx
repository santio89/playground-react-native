import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectLang, selectDarkMode, selectColorTheme, getSettingsFirebase } from '../store/actions/settings.action.js';
import Constants from '../constants/Styles'
import { LANGS } from '../constants/Langs.js';
import Header from '../components/Header'

const Settings = ({ navigation }) => {

    const dispatch = useDispatch()

    const userId = useSelector(state => state.auth.userId)
    const { language } = useSelector(state => state.settings)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === language.selected).text)

    const [config, setConfig] = useState({ lang: language.selected, darkMode, altColorTheme });

    const dispatchGetSettingsFirebase = () => {
        dispatch(getSettingsFirebase(userId));
    }

    useEffect(() => {
        dispatch(selectLang(config.lang))
    }, [config.lang])

    useEffect(() => {
        dispatch(selectDarkMode(config.darkMode))
    }, [config.darkMode])

    useEffect(() => {
        dispatch(selectColorTheme(config.altColorTheme))
    }, [config.altColorTheme])

    useEffect(() => {
        setText(LANGS.find(lang => lang.lang === language.selected).text)
    }, [language.selected])

    useEffect(() => {
        setConfig({ lang: language.selected, darkMode, altColorTheme })
    }, [language.selected, altColorTheme, darkMode])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.config} | PLAYGROUND`,
            headerShown: false
        })
    }, [text])

    useEffect(() => {
        userId && dispatchGetSettingsFirebase()
    }, [])

    return (
        <>
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={[styles.settingsContainer, !darkMode && styles.backgroundWhite, !darkMode && styles.colorDark]}>
                <View style={[styles.itemsContainer, altColorTheme && styles.altItemsContainer]}>
                    <View style={styles.settingsItem}>
                        <Text style={[styles.settingsItemLabel]}><Text style={[styles.settingsItemIndicator, altColorTheme && styles.altSettingsItemIndicator]}>●&nbsp;</Text><Text>{text.language}: </Text></Text>
                        <View style={styles.settingsItemTextWrapper}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.lang === "english" && styles.itemSelected]} onPress={() => { setConfig(config => ({ ...config, lang: "english" })) }}><Text style={[styles.settingsItemText, config.lang === "english" && styles.itemSelected]}>{text.english}</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.lang === "spanish" && styles.itemSelected]} onPress={() => { setConfig(config => ({ ...config, lang: "spanish" })) }}><Text style={[styles.settingsItemText, config.lang === "spanish" && styles.itemSelected]}>{text.spanish}</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.settingsItem}>
                        <Text style={[styles.settingsItemLabel]}><Text style={[styles.settingsItemIndicator, altColorTheme && styles.altSettingsItemIndicator]}>●&nbsp;</Text><Text>{text.darkMode}: </Text></Text>
                        <View style={styles.settingsItemTextWrapper}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, !config.darkMode && styles.itemSelected]} onPress={() => { setConfig(config => ({ ...config, darkMode: false })) }}><Text style={[styles.settingsItemText, !config.darkMode && styles.itemSelected]}>{text.inactive}</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.darkMode && styles.itemSelected]} onPress={() => { setConfig(config => ({ ...config, darkMode: true })) }}><Text style={[styles.settingsItemText, config.darkMode && styles.itemSelected]}>{text.active}</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.settingsItem}>
                        <Text style={[styles.settingsItemLabel]}><Text style={[styles.settingsItemIndicator, altColorTheme && styles.altSettingsItemIndicator]}>●&nbsp;</Text><Text>{text.colorTheme}: </Text></Text>
                        <View style={styles.settingsItemTextWrapper}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.altColorTheme === false && styles.itemSelected, styles.backgroundPrimary]} onPress={() => { setConfig(config => ({ ...config, altColorTheme: false })) }}><Text style={[styles.settingsItemText, config.altColorTheme === false && styles.itemSelected]}>{text.purple}</Text></TouchableOpacity>

                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.altColorTheme === true && styles.itemSelected, styles.backgroundSecondary]} onPress={() => { setConfig(config => ({ ...config, altColorTheme: true })) }}><Text style={[styles.settingsItemText, config.altColorTheme === true && styles.itemSelected]}>{text.orange}</Text></TouchableOpacity>
                        </View>
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
        padding: 10,
        paddingBottom: 10,
        backgroundColor: Constants.colorPrimary,
        borderRadius: 8,
        borderWidth: 2,
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
    settingsItemTextWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 4,
        marginBottom: 4
    },
    settingsItemTextButton: {
        flex: .5,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: 'darkgray',
        backgroundColor: Constants.colorPrimaryDark,
        textAlign: 'center',
        marginLeft: '1%',
        marginRight: '1%',
        padding: 8,
        color: Constants.colorDark,
        maxWidth: '100%'
    },
    settingsItemText: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorDark,
    },
    itemSelected: {
        color: Constants.colorWhite,
        borderColor: Constants.colorWhite
    },
    backgroundPrimary: {
        backgroundColor: Constants.colorPrimaryDark
    },
    backgroundSecondary: {
        backgroundColor: Constants.colorSecondaryDark
    },
    /* for dark mode off */
    backgroundWhite: {
        backgroundColor: Constants.colorWhite
    },
    colorDark: {
        color: Constants.colorDark
    },
    /* for alt color theme */
    altItemsContainer: {
        backgroundColor: Constants.colorSecondary,
        borderColor: Constants.colorSecondaryDark,
    },
    altSettingsItemIndicator: {
        color: Constants.colorSecondaryDark
    },
    altSettingsItemTextButton: {
        backgroundColor: Constants.colorSecondaryDark,
    },
})