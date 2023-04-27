import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, ActivityIndicator, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { LANGS } from '../constants/Langs.js'
import Constants from '../constants/Styles.js'
import Header from '../components/Header'
import { logOut, refreshToken, getUserData, updateAvatar, updateUsername } from '../store/actions/auth.action.js'
import Emojis from '../constants/Emojis.js'
import { LinearGradient } from 'expo-linear-gradient'

const Profile = ({ navigation }) => {
    const dispatch = useDispatch();

    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const { selected: languageSelected } = useSelector(state => state.settings.language)

    const userId = useSelector(state => state.auth.userId)
    const id_token = useSelector(state => state.auth.token)
    const refresh_token = useSelector(state => state.auth.refreshToken)
    const token = useSelector(state => state.auth.token)
    const email = useSelector(state => state.auth.email)
    const displayName = useSelector(state => state.auth.displayName)
    const avatar = useSelector(state => state.auth.avatar)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

    const [logOutSuccess, setLogOutSuccess] = useState(false)

    const [inputUsername, setInputUsername] = useState("")
    const [usernameModal, setUsernameModal] = useState(false)
    const [usernameValidInput, setUsernameValidInput] = useState(false)
    const [updateUsernameLoading, setUpdateUsernameLoading] = useState(false)

    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const [avatarModal, setAvatarModal] = useState(false)
    const [updateAvatarLoading, setUpdateAvatarLoading] = useState(false)

    const dispatchRefreshToken = () => {
        dispatch(refreshToken(refresh_token))
    }

    const dispatchGetUserData = () => {
        dispatch(getUserData(id_token))
    }

    const validateName = (name) => {
        var re = /[^ ]{4,16}/;
        return re.test(name);
    };

    useEffect(() => {
        validateName(inputUsername) ? setUsernameValidInput(true) : setUsernameValidInput(false)
    }, [inputUsername])

    useEffect(() => {
        setText(LANGS.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.profile} | PLAYGROUND`,
            headerShown: false
        })
    }, [text])

    useEffect(() => {
        setSelectedAvatar(avatar)
    }, [avatar])

    useEffect(() => {
        userId && dispatchRefreshToken()
        userId && dispatchGetUserData()
    }, [])

    return (
        <>
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={[styles.profileContainer, !darkMode && styles.colorDark, !darkMode && styles.backgroundWhite]}>
                <View style={[styles.itemsContainer, altColorTheme && styles.altItemsContainer]}>
                    {userId ?
                        <>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.email}: </Text></Text>
                                <View style={[styles.profileItemButton, altColorTheme && styles.altProfileItemButton, { borderStyle: 'solid' }]}>
                                    <Text style={[styles.profileItemText]}>{email?.toLocaleUpperCase()}</Text>
                                </View>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.name}: </Text></Text>
                                <TouchableOpacity style={[styles.profileItemButton, altColorTheme && styles.altProfileItemButton]} onPress={() => { setInputUsername(""), setUsernameModal(true) }}>
                                    <Text style={[styles.profileItemText]}>{displayName?.toLocaleUpperCase()}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.avatar}: </Text></Text>
                                <TouchableOpacity style={[styles.profileItemButton, altColorTheme && styles.altProfileItemButton]}>
                                    <LinearGradient
                                        colors={altColorTheme ? [Constants.colorSecondaryDark, Constants.colorSecondary, Constants.colorSecondaryDark] : [Constants.colorPrimaryDark, Constants.colorPrimary, Constants.colorPrimaryDark]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, zIndex: -1, }}
                                    />
                                    <Text style={styles.profileItemAvatar} onPress={() => { setAvatarModal(true) }}>{avatar}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.profileItem}>
                                <View style={[styles.profileItemLabel]}>
                                    <Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text>
                                    <TouchableOpacity style={[styles.profileItemButton, altColorTheme && styles.altProfileItemButton, { borderStyle: 'solid' }]} onPress={() => { dispatch(logOut()); setLogOutSuccess(true) }}>
                                        <Text style={[styles.settingsItemText, { fontWeight: 'bold' }]}>{text.logOut}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </> :
                        <View style={[styles.profileItem, { justifyContent: "center", alignItems: "center", marginTop: 10 }]}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, { padding: 16 }, altColorTheme && styles.altSettingsItemTextButton]} onPress={() => { navigation.navigate("Auth", { screen: "LogIn" }) }}>
                                <Text style={[styles.settingsItemText, { fontFamily: Constants.fontPrimaryBold, fontSize: Constants.fontLg }]}>{text.logInProfile}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </ScrollView>


            {/* log out modal */}
            <Modal visible={logOutSuccess} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <Text style={styles.modalTitle}>
                            <Text>{`${text.goodbye}\n`}</Text>
                            <Text style={[styles.modalText, altColorTheme && styles.altModalText]}>{text.userLoggedOut}</Text>
                        </Text>
                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setLogOutSuccess(false); navigation.navigate("AppsHome") }}>
                                <Text style={[styles.modalBtnText]}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* username modal */}
            <Modal visible={usernameModal} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <View style={styles.modalTitle}>
                            <Text style={[styles.modalTitle, { marginBottom: 0 }]}>{text.inputUsername}</Text>
                            <KeyboardAvoidingView style={[styles.modalText, altColorTheme && styles.altModalText]}>
                                <TextInput style={[styles.inputUsername, altColorTheme && styles.altInputUsername, (inputUsername != "" && !usernameValidInput) && { borderBottomColor: Constants.colorRed }]} autoCapitalize='none' placeholder={text.minName} placeholderTextColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} value={inputUsername} onChangeText={(inputUsername) => { setInputUsername(inputUsername.toLocaleUpperCase()) }} onSubmitEditing={() => { usernameValidInput && setUpdateUsernameLoading(true), usernameValidInput && dispatchRefreshToken(), usernameValidInput && dispatch(updateUsername(token, avatar + inputUsername.trim(), setUpdateUsernameLoading, setUsernameModal, dispatchRefreshToken)) }} />
                            </KeyboardAvoidingView>
                        </View>

                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setUsernameModal(false); setInputUsername("") }}>
                                <Text style={[styles.modalBtnText]}>{text.close}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity disabled={!usernameValidInput || inputUsername === "" || updateUsernameLoading} style={[styles.modalBtn, altColorTheme && styles.altModalBtn, !usernameValidInput && { borderColor: 'darkgray' }]} onPress={() => { usernameValidInput && setUpdateUsernameLoading(true), usernameValidInput && dispatchRefreshToken(), usernameValidInput && dispatch(updateUsername(token, avatar + inputUsername.trim(), setUpdateUsernameLoading, setUsernameModal, dispatchRefreshToken)) }}>
                                {updateUsernameLoading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <Text style={[styles.modalBtnText, !usernameValidInput && { color: 'darkgray' }]}>OK</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* avatar modal */}
            <Modal visible={avatarModal} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <View style={styles.modalTitle}>
                            <Text style={[styles.modalTitle, { marginBottom: 0 }]}>{text.inputAvatar}</Text>
                            <KeyboardAvoidingView style={[styles.modalText, altColorTheme && styles.altModalText]}>
                                <FlatList style={styles.avatarContainer}
                                    data={[...Emojis]}
                                    horizontal
                                    pagingEnabled
                                    snapToAlignment="start"
                                    decelerationRate="fast"
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={[styles.avatarItem, altColorTheme && styles.altAvatarItem, item === selectedAvatar && styles.avatarSelected]} onPress={() => setSelectedAvatar(item)}>
                                            <Text style={styles.avatarItemText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={item => item}
                                />
                            </KeyboardAvoidingView>
                        </View>

                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setAvatarModal(false); setSelectedAvatar(avatar) }}>
                                <Text style={[styles.modalBtnText]}>{text.close}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity disabled={selectedAvatar === avatar || updateAvatarLoading} style={[styles.modalBtn, altColorTheme && styles.altModalBtn, selectedAvatar === avatar && { borderColor: 'darkgray' }]} onPress={() => { selectedAvatar != avatar && setUpdateAvatarLoading(true), selectedAvatar != avatar && dispatchRefreshToken(), selectedAvatar != avatar && dispatch(updateAvatar(token, selectedAvatar + displayName, setAvatarModal, setUpdateAvatarLoading, dispatchRefreshToken)) }}>
                                {updateAvatarLoading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <Text style={[styles.modalBtnText, selectedAvatar === avatar && { color: 'darkgray' }]}>OK</Text>}
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
        /* padding: 10 */
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
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    profileItemText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        maxWidth: '100%'
    },
    profileItemImage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 4,
        marginTop: 8
    },
    profileItemButton: {
        backgroundColor: Constants.colorPrimaryDark,
        padding: 8,
        borderRadius: 4,
        marginTop: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: Constants.colorPrimary,
        maxWidth: '100%'
    },
    profileItemAvatar: {
        fontSize: Constants.fontXlll,
        textAlign: 'center'
    },
    settingsItemTextButton: {
        borderWidth: 1,
        borderRadius: 4,
        borderColor: Constants.colorWhite,
        backgroundColor: Constants.colorPrimaryDark,
        textAlign: 'center',
        marginLeft: '1%',
        marginRight: '1%',
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
        minHeight: 300,
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
        minHeight: 300,
    },
    modalTitle: {
        fontSize: Constants.fontLg,
        fontWeight: 'bold',
        fontFamily: Constants.fontPrimaryBold,
        color: Constants.colorWhite,
        marginBottom: 20,
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
        textAlign: 'center',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
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
        width: 120,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
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
    inputUsername: {
        width: '100%',
        fontSize: Constants.fontLg,
        color: Constants.colorWhite,
        paddingHorizontal: 4,
        paddingVertical: 16,
        backgroundColor: 'transparent',
        borderBottomWidth: 4,
        borderBottomColor: Constants.colorPrimary,
        textAlign: 'center',
    },
    avatarContainer: {
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        padding: 10,
    },
    avatarItem: {
        width: 60,
        padding: 4,
        marginRight: 4,
        marginLeft: 4,
        borderRadius: 4,
        backgroundColor: Constants.colorPrimary,
    },
    avatarItemText: {
        fontSize: Constants.fontXl,
        textAlign: 'center',
    },
    avatarSelected: {
        borderColor: Constants.colorWhite,
        borderStyle: 'solid',
        borderWidth: 1,
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
    altProfileItemButton: {
        backgroundColor: Constants.colorSecondaryDark,
        borderColor: Constants.colorSecondary,
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
    altInputUsername: {
        borderBottomColor: Constants.colorSecondary,
    },
    altAvatarItem: {
        backgroundColor: Constants.colorSecondary,
    }
})