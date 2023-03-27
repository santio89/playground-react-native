import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectLang } from '../store/actions/language.action.js';
import { storageGetItem, storageSetItem } from '../utils/AsyncStorage.js';
import Constants from '../constants/Styles.js'
import Header from '../components/Header.js'

const Settings = () => {

    const dispatch = useDispatch()

    const { selected: languageSelected, langs } = useSelector(state => state.languages)

    const [text, setText] = useState(langs.find(lang => lang.lang === languageSelected).text)

    const [config, setConfig] = useState({lang: "english", darkMode: "enabled", colorTheme: "purple"});


    /* storage-settings/config */
    const storeData = async (score) => {
        try {
            await storageSetItem("pg-config", JSON.stringify(config));
        } catch (error) {
            console.log("error saving data to storage")
        }
    };

    const retrieveData = async () => {
        try {
            const value = await storageGetItem('pg-config');
            if (value !== null) {
                setConfig(JSON.parse(value))
            }
        } catch (error) {
            console.log("error retrieving data from storage")
        }
    };

    useEffect(() => {
        retrieveData()
    }, [])

    useEffect(()=>{
        dispatch(selectLang(config.lang))
    }, [config])

    useEffect(() => {
        setText(langs.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

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
                            <TouchableOpacity style={[styles.settingsItemTextButton, config.darkMode==="disabled" && styles.itemSelected]} /* onPress={()=>{setConfig(config=>({...config, darkMode: "disabled"}))}} */><Text style={[styles.settingsItemText, config.darkMode==="disabled" && styles.itemSelected]}>{text.disabled}</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.settingsItemTextButton, config.darkMode==="enabled" && styles.itemSelected]} onPress={()=>{setConfig(config=>({...config, darkMode: "enabled"}))}}><Text style={[styles.settingsItemText, config.darkMode==="enabled" && styles.itemSelected]}>{text.enabled}</Text></TouchableOpacity>
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