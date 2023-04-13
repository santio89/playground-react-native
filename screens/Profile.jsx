import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Modal, SafeAreaView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { LANGS } from '../constants/Langs.js'
import Constants from '../constants/Styles.js'
import Header from '../components/Header'
import { logOut } from '../store/actions/auth.action.js'

const Profile = ({ navigation }) => {
    const dispatch = useDispatch();


    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const { selected: languageSelected } = useSelector(state => state.settings.language)

    const email = useSelector(state => state.auth.email)
    const displayName = useSelector(state => state.auth.displayName)
    const avatar = useSelector(state => state.auth.avatar)

    const userId = useSelector(state => state.auth.userId)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

    const [logOutSuccess, setLogOutSuccess] = useState(false)


    useEffect(() => {
        setText(LANGS.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.profile} | PLAYGROUND`,
            headerShown: false
        })
    }, [text])

    return (
        <>
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={[styles.profileContainer, !darkMode && styles.colorDark, !darkMode && styles.backgroundWhite]}>
                <View style={[styles.itemsContainer, altColorTheme && styles.altItemsContainer]}>
                    {userId ?
                        <>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.email}: </Text></Text>
                                <Text style={[styles.profileItemText]}>{email?.toLocaleUpperCase()}</Text>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.name}: </Text></Text>
                                <Text style={[styles.profileItemText]}>{displayName?.toLocaleUpperCase()}</Text>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.avatar}: </Text></Text>
                                <TouchableOpacity><Text style={[styles.profileItemAvatar, altColorTheme && styles.altProfileItemAvatar]}>{avatar}</Text></TouchableOpacity>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}>
                                    <Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text>
                                    <TouchableOpacity style={[styles.settingsItemTextButton, altColorTheme && styles.altSettingsItemTextButton]} onPress={() => { dispatch(logOut()); setLogOutSuccess(true) }}><Text style={[styles.settingsItemText]}>{text.logOut}</Text></TouchableOpacity>
                                </Text>
                            </View>
                        </> :
                        <View style={[styles.profileItem, { justifyContent: "center", alignItems: "center", marginTop: 10 }]}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, { padding: 16 }, altColorTheme && styles.altSettingsItemTextButton]} onPress={() => { navigation.navigate("Auth", {screen: "LogIn"}) }}><Text style={[styles.settingsItemText, { fontFamily: Constants.fontPrimaryBold, fontSize: Constants.fontLg }]}>{text.logInProfile}</Text></TouchableOpacity>
                        </View>
                    }
                </View>
            </ScrollView>

            <Modal visible={logOutSuccess} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <Text style={styles.modalTitle}>
                            <Text>{`${text.goodbye}\n`}</Text>
                            <Text style={[styles.modalText, altColorTheme && styles.altModalText]}>{text.userLoggedOut}</Text>
                        </Text>
                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]}>
                                <Text style={[styles.modalBtnText]} onPress={() => { setLogOutSuccess(false); navigation.navigate("Apps", {screen: "AppsHome"}) }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    )
}

export default Profile

const styles = StyleSheet.create({
    profileContainer: {
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
        paddingBottom: 0,
        backgroundColor: Constants.colorPrimary,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Constants.colorPrimaryDark,
    },
    profileItemIndicator: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorPrimaryDark,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    profileItem: {
        marginBottom: 20,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    profileItemLabel: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    profileItemText: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorDark,
    },
    profileItemImage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 4,
        marginTop: 8
    },
    profileItemAvatar: {
        fontSize: Constants.fontXll,
        backgroundColor: Constants.colorPrimaryDark,
        padding: 8,
        borderRadius: 4,
        marginTop: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    settingsItemTextButton: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Constants.colorWhite,
        backgroundColor: Constants.colorPrimaryDark,
        textAlign: 'center',
        marginInline: '1%',
        padding: 8,
        color: Constants.colorWhite,
        maxWidth: '100%',
    },
    settingsItemText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        maxWidth: '100%',
        textAlign: 'center'
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
        minWidth: 300,
        maxWidth: 600,
        height: 300,
    },
    modalInner: {
        backgroundColor: Constants.colorPrimary,
        borderColor: Constants.colorWhite,
        borderRadius: 4,
        borderWidth: 2,
        padding: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 300,
    },
    modalTitle: {
        fontSize: Constants.fontLg,
        fontWeight: 'bold',
        fontFamily: Constants.fontPrimaryBold,
        color: Constants.colorWhite,
        marginBottom: 40,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    modalText: {
        fontFamily: Constants.fontPrimary,
        backgroundColor: Constants.colorPrimaryDark,
        padding: 8,
        borderRadius: 4,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: 20,
        textAlign: 'center'
    },
    modalBtnContainer: {
        flexDirection: 'row',
        maxWidth: '100%'
    },
    modalBtn: {
        padding: 8,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        backgroundColor: Constants.colorPrimaryDark,
        borderColor: Constants.colorWhite,
        marginHorizontal: 10,
        width: 100,
        textAlign: 'center'
    },
    modalBtnText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        textAlign: 'center'
    },
    modalBorderDark: {
        borderColor: Constants.colorDark,
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
    altProfileItemIndicator: {
        color: Constants.colorSecondaryDark,
    },
    altProfileItemAvatar: {
        backgroundColor: Constants.colorSecondaryDark,
    },
    altSettingsItemTextButton: {
        backgroundColor: Constants.colorSecondaryDark,
    },
    altModalInner: {
        backgroundColor: Constants.colorSecondary,

    },
    altModalBtn: {
        backgroundColor: Constants.colorSecondaryDark,
    },
    altModalText: {
        backgroundColor: Constants.colorSecondaryDark,
    },
})