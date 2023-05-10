import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectLang, selectDarkMode, selectColorTheme, getSettingsFirebase } from '../store/actions/settings.action.js';
import Constants from '../constants/Styles'
import { LANGS } from '../constants/Langs.js';
import Header from '../components/Header'
import { LinearGradient } from 'expo-linear-gradient';

const Settings = ({ navigation }) => {

    const dispatch = useDispatch()

    const { language } = useSelector(state => state.settings)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === language.selected).text)

    const [config, setConfig] = useState({ lang: language.selected, darkMode, altColorTheme });


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

    return (
        <>
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={[styles.settingsContainer, !darkMode && styles.backgroundWhite, !darkMode && styles.colorDark]}>
                <View style={[styles.itemsContainer, altColorTheme && styles.altItemsContainer]}>
                    <View style={styles.settingsItem}>
                        <Text style={[styles.settingsItemLabel]}><Text style={[styles.settingsItemIndicator, altColorTheme && styles.altSettingsItemIndicator]}>•&nbsp;</Text><Text>{text.language}: </Text></Text>
                        <View style={styles.settingsItemTextWrapper}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.lang === "english" && styles.itemSelected]} onPress={() => { setConfig(config => ({ ...config, lang: "english" })) }}>
                                <LinearGradient
                                    colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? (config.lang === "english" ? Constants.colorSecondary : Constants.colorSecondaryDark) : (config.lang === "english" ? Constants.colorPrimary : Constants.colorPrimaryDark), altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, zIndex: -1 }}
                                />
                                <Text style={[styles.settingsItemText, config.lang === "english" && styles.itemSelected]}>{text.english}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.lang === "spanish" && styles.itemSelected]} onPress={() => { setConfig(config => ({ ...config, lang: "spanish" })) }}>
                                <LinearGradient
                                    colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? (config.lang === "spanish" ? Constants.colorSecondary : Constants.colorSecondaryDark) : (config.lang === "spanish" ? Constants.colorPrimary : Constants.colorPrimaryDark), altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, zIndex: -1 }}
                                />
                                <Text style={[styles.settingsItemText, config.lang === "spanish" && styles.itemSelected]}>{text.spanish}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.settingsItem}>
                        <Text style={[styles.settingsItemLabel]}><Text style={[styles.settingsItemIndicator, altColorTheme && styles.altSettingsItemIndicator]}>•&nbsp;</Text><Text>{text.darkMode}: </Text></Text>
                        <View style={styles.settingsItemTextWrapper}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, !config.darkMode && styles.itemSelected]} onPress={() => { setConfig(config => ({ ...config, darkMode: false })) }}>
                                <LinearGradient
                                    colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? (!config.darkMode ? Constants.colorSecondary : Constants.colorSecondaryDark) : (!config.darkMode ? Constants.colorPrimary : Constants.colorPrimaryDark), altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, zIndex: -1 }}
                                />
                                <Text style={[styles.settingsItemText, !config.darkMode && styles.itemSelected]}>{text.inactive}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.darkMode && styles.itemSelected]} onPress={() => { setConfig(config => ({ ...config, darkMode: true })) }}>
                                <LinearGradient
                                    colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? (config.darkMode ? Constants.colorSecondary : Constants.colorSecondaryDark) : (config.darkMode ? Constants.colorPrimary : Constants.colorPrimaryDark), altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, zIndex: -1 }}
                                />
                                <Text style={[styles.settingsItemText, config.darkMode && styles.itemSelected]}>{text.active}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.settingsItem}>
                        <Text style={[styles.settingsItemLabel]}><Text style={[styles.settingsItemIndicator, altColorTheme && styles.altSettingsItemIndicator]}>•&nbsp;</Text><Text>{text.colorTheme}: </Text></Text>
                        <View style={styles.settingsItemTextWrapper}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.altColorTheme === false && styles.itemSelected, styles.backgroundPrimary]} onPress={() => { setConfig(config => ({ ...config, altColorTheme: false })) }}>
                                <LinearGradient
                                    colors={[Constants.colorPrimaryDark, config.altColorTheme === false ? Constants.colorPrimary : Constants.colorPrimaryDark, Constants.colorPrimaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, zIndex: -1 }}
                                />
                                <Text style={[styles.settingsItemText, config.altColorTheme === false && styles.itemSelected]}>{text.purple}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, config.altColorTheme === true && styles.itemSelected, styles.backgroundSecondary]} onPress={() => { setConfig(config => ({ ...config, altColorTheme: true })) }}>
                                <LinearGradient
                                    colors={[Constants.colorSecondaryDark, config.altColorTheme === true ? Constants.colorSecondary : Constants.colorSecondaryDark, Constants.colorSecondaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, zIndex: -1 }}
                                />
                                <Text style={[styles.settingsItemText, config.altColorTheme === true && styles.itemSelected]}>{text.orange}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* web-only-apk-download */}
                    {Platform.OS === 'web' &&
                        <View style={styles.settingsItem}>
                            <Text style={[styles.settingsItemLabel]}><Text style={[styles.settingsItemIndicator, altColorTheme && styles.altSettingsItemIndicator]}>•&nbsp;</Text><Text>{text.tryMobile}: </Text></Text>
                            <View style={[styles.settingsItemTextWrapper]}>
                                <TouchableOpacity onPress={() => { Linking.openURL("https://drive.google.com/uc?export=download&id=1h0ZfS9qoTkGD11ja89G0dNAd558Wc2Pa") }} style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton, styles.itemSelected]} >
                                    <LinearGradient
                                        colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? Constants.colorSecondary : Constants.colorPrimary, altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, zIndex: -1 }}
                                    />
                                    <Text style={[styles.settingsItemText, styles.itemSelected]}>{text.downloadApk}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
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
        /* padding: 10 */
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
        width: '100%',
        maxWidth: 370
    },
    settingsItemText: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorDark,
        textAlign: 'center'
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