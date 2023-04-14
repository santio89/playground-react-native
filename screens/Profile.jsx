import { StyleSheet, Text, ScrollView, View, TouchableOpacity, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, ActivityIndicator, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { LANGS } from '../constants/Langs.js'
import Constants from '../constants/Styles.js'
import Header from '../components/Header'
import { logOut, refreshToken, updateAvatar, updateUsername } from '../store/actions/auth.action.js'
import Emojis from '../constants/Emojis.js'

const Profile = ({ navigation }) => {
    const dispatch = useDispatch();

    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const { selected: languageSelected } = useSelector(state => state.settings.language)

    const refresh_token = useSelector(state=>state.auth.refreshToken)
    const token = useSelector(state => state.auth.token)
    const email = useSelector(state => state.auth.email)
    const displayName = useSelector(state => state.auth.displayName)
    const avatar = useSelector(state => state.auth.avatar)

    const userId = useSelector(state => state.auth.userId)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

    const [logOutSuccess, setLogOutSuccess] = useState(false)

    const [inputUsername, setInputUsername] = useState("")
    const [usernameModal, setUsernameModal] = useState(false)
    const [usernameValidInput, setUsernameValidInput] = useState(false)
    const [updateUsernameLoading, setUpdateUsernameLoading] = useState(false)

    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const [avatarModal, setAvatarModal] = useState(false)
    const [updateAvatarLoading, setUpdateAvatarLoading] = useState(false)

    const dispatchRefreshToken = ()=>{
        dispatch(refreshToken(refresh_token))
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

    return (
        <>
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={[styles.profileContainer, !darkMode && styles.colorDark, !darkMode && styles.backgroundWhite]}>
                <View style={[styles.itemsContainer, altColorTheme && styles.altItemsContainer]}>
                    {userId ?
                        <>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.email}: </Text></Text>
                                <View style={[styles.profileItemButton, altColorTheme && styles.altProfileItemButton, { borderStyle: 'solid' }]}><Text style={[styles.profileItemText]}>{email?.toLocaleUpperCase()}</Text></View>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.name}: </Text></Text>
                                <TouchableOpacity style={[styles.profileItemButton, altColorTheme && styles.altProfileItemButton]} onPress={() => { setInputUsername(""), setUsernameModal(true) }}><Text style={[styles.profileItemText]}>{displayName?.toLocaleUpperCase()}</Text></TouchableOpacity>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.avatar}: </Text></Text>
                                <TouchableOpacity style={[styles.profileItemButton, altColorTheme && styles.altProfileItemButton]}><Text style={styles.profileItemAvatar} onPress={() => setAvatarModal(true)}>{avatar}</Text></TouchableOpacity>
                            </View>
                            <View style={styles.profileItem}>
                                <Text style={[styles.profileItemLabel]}>
                                    <Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text>
                                    <TouchableOpacity style={[styles.profileItemButton, altColorTheme && styles.altProfileItemButton, { borderStyle: 'solid' }]} onPress={() => { dispatch(logOut()); setLogOutSuccess(true) }}><Text style={[styles.settingsItemText, { fontWeight: 'bold' }]}>{text.logOut}</Text></TouchableOpacity>
                                </Text>
                            </View>
                        </> :
                        <View style={[styles.profileItem, { justifyContent: "center", alignItems: "center", marginTop: 10 }]}>
                            <TouchableOpacity style={[styles.settingsItemTextButton, { padding: 16 }, altColorTheme && styles.altSettingsItemTextButton]} onPress={() => { navigation.navigate("Auth", { screen: "LogIn" }) }}><Text style={[styles.settingsItemText, { fontFamily: Constants.fontPrimaryBold, fontSize: Constants.fontLg }]}>{text.logInProfile}</Text></TouchableOpacity>
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
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]}>
                                <Text style={[styles.modalBtnText]} onPress={() => { setLogOutSuccess(false); navigation.navigate("Apps", { screen: "AppsHome" }) }}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* username modal */}
            <Modal visible={usernameModal} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <Text style={styles.modalTitle}>
                            <Text>{text.inputUsername}</Text>
                            <KeyboardAvoidingView style={[styles.modalText, altColorTheme && styles.altModalText]}>
                                <TextInput style={[styles.inputUsername, altColorTheme && styles.altInputUsername, (inputUsername != "" && !usernameValidInput) && { borderBottomColor: Constants.colorRed }]} autoCapitalize='none' placeholder={text.minName} placeholderTextColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} value={inputUsername} onChangeText={(inputUsername) => { setInputUsername(inputUsername.toLocaleUpperCase()) }} onSubmitEditing={() => { usernameValidInput && dispatch(updateUsername(token, avatar + inputUsername.trim(), setUpdateUsernameLoading, setUsernameModal, dispatchRefreshToken)) }} />
                            </KeyboardAvoidingView>
                        </Text>

                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]}>
                                <Text style={[styles.modalBtnText]} onPress={() => { setUsernameModal(false); setInputUsername("") }}>{text.close}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity disabled={!usernameValidInput || inputUsername === "" || updateUsernameLoading} style={[styles.modalBtn, altColorTheme && styles.altModalBtn, !usernameValidInput && { borderColor: 'darkgray' }]}>
                                {updateUsernameLoading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <Text style={[styles.modalBtnText, !usernameValidInput && { color: 'darkgray' }]} onPress={() => { usernameValidInput && dispatch(updateUsername(token, avatar + inputUsername.trim(), setUpdateUsernameLoading, setUsernameModal, dispatchRefreshToken)) }}>OK</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>

            {/* avatar modal */}
            <Modal visible={avatarModal} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <Text style={styles.modalTitle}>
                            <Text>{text.inputAvatar}</Text>
                            <KeyboardAvoidingView style={[styles.modalText, altColorTheme && styles.altModalText]}>
                                <FlatList style={styles.avatarContainer}
                                    data={[...Emojis]}
                                    horizontal={true}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => setSelectedAvatar(item)}>
                                            <Text style={[styles.avatarItem, altColorTheme && styles.altAvatarItem, item === selectedAvatar && styles.avatarSelected]}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={item => item}
                                />
                            </KeyboardAvoidingView>
                        </Text>

                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]}>
                                <Text style={[styles.modalBtnText]} onPress={() => { setAvatarModal(false); setSelectedAvatar(avatar) }}>{text.close}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity disabled={selectedAvatar === avatar || updateAvatarLoading} style={[styles.modalBtn, altColorTheme && styles.altModalBtn, selectedAvatar === avatar && { borderColor: 'darkgray' }]}>
                                {updateAvatarLoading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <Text style={[styles.modalBtnText, selectedAvatar === avatar && { color: 'darkgray' }]} onPress={() => { selectedAvatar != avatar && dispatch(updateAvatar(token, selectedAvatar + displayName, setAvatarModal, setUpdateAvatarLoading, dispatchRefreshToken)) }}>OK</Text>}
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
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    profileItemText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
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
        borderWidth: 2,
        borderColor: Constants.colorPrimary,
        borderStyle: 'dashed'
    },
    profileItemAvatar: {
        fontSize: Constants.fontXll,
        textAlign: 'center'
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
        textAlign: 'center',
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
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBtnText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        textAlign: 'center',
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
        overflow: 'hidden',
        padding: 10
    },
    avatarItem: {
        fontSize: Constants.fontXl,
        padding: 4,
        backgroundColor: Constants.colorPrimary,
        marginInline: 4,
        borderRadius: 4,
        width: 60,
        textAlign: 'center',
    },
    avatarSelected: {
        outlineWidth: 1,
        outlineStyle: 'solid',
        outlineColor: Constants.colorWhite
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
        borderColor: Constants.colorSecondaryDark,
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