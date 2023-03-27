import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectLang, selectDarkMode, selectColorTheme } from '../store/actions/settings.action.js';
import Constants from '../constants/Styles'
import Header from '../components/Header'

const Settings = () => {

    const dispatch = useDispatch()

    const { language, darkMode, colorTheme } = useSelector(state => state.settings)

    const [text, setText] = useState(language.langs.find(lang => lang.lang === language.selected).text)

    const [config, setConfig] = useState({lang: "english", darkMode: true, colorTheme: "purple"});


    useEffect(()=>{
        dispatch(selectLang(config.lang))
    }, [config.lang])

    useEffect(()=>{
        dispatch(selectDarkMode(config.darkMode))
    }, [config.darkMode])

/*     useEffect(()=>{
        dispatch(selectLang(config.lang))
    }, [config.colorTheme]) */

    useEffect(() => {
        setText(language.langs.find(lang => lang.lang === language.selected).text)
    }, [language.selected])

    return (
        <>
            <Header />
            <ScrollView contentContainerStyle={styles.settingsContainer}>
                <View style={styles.itemsContainer}>
                    <View style={styles.settingsItem}>
                        <Text style={styles.settingsItemLabel}><Text style={styles.settingsItemIndicator}>●&nbsp;</Text><Text>{text.language}: </Text></Text>
                        <View style={styles.settingsItemTextWrapper}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, config.lang==="english" && styles.itemSelected]} onPress={()=>{setConfig(config=>({...config, lang: "english"}))}}><Text style={[styles.settingsItemText, config.lang==="english" && styles.itemSelected]}>{text.english}</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.settingsItemTextButton, config.lang==="spanish" && styles.itemSelected]} onPress={()=>{setConfig(config=>({...config, lang: "spanish"}))}}><Text style={[styles.settingsItemText, config.lang==="spanish" && styles.itemSelected]}>{text.spanish}</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.settingsItem}>
                        <Text style={styles.settingsItemLabel}><Text style={styles.settingsItemIndicator}>●&nbsp;</Text><Text>{text.darkMode}: </Text></Text>
                        <View style={styles.settingsItemTextWrapper}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, !config.darkMode && styles.itemSelected]} onPress={()=>{setConfig(config=>({...config, darkMode: false}))}}><Text style={[styles.settingsItemText, !config.darkMode && styles.itemSelected]}>{text.disabled}</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.settingsItemTextButton, config.darkMode && styles.itemSelected]} onPress={()=>{setConfig(config=>({...config, darkMode: true}))}}><Text style={[styles.settingsItemText, config.darkMode && styles.itemSelected]}>{text.enabled}</Text></TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.settingsItem}>
                        <Text style={styles.settingsItemLabel}><Text style={styles.settingsItemIndicator}>●&nbsp;</Text><Text>{text.colorTheme}: </Text></Text>
                        <View style={styles.settingsItemTextWrapper}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, config.colorTheme==="purple" && styles.itemSelected]} onPress={()=>{setConfig(config=>({...config, colorTheme: "purple"}))}}><Text style={[styles.settingsItemText, config.colorTheme==="purple" && styles.itemSelected]}>{text.purple}</Text></TouchableOpacity>
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
    settingsItemTextWrapper: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 4,
        marginBottom: 4
    },
    settingsItemTextButton: {
        flex: .5,
        borderWidth: 2,
        borderRadius: 4,
        borderColor: 'darkgray',
        backgroundColor: Constants.colorPrimaryDark,
        textAlign: 'center',
        marginInline: 4,
        padding: 8,
        color: Constants.colorDark
    },
    settingsItemText: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorDark,
    },
    itemSelected: {
        color: Constants.colorWhite,
        borderColor: Constants.colorWhite
    }
})