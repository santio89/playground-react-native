import { StyleSheet, Text, View, ScrollView, SafeAreaView, Modal, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logIn } from '../store/actions/auth.action'
import Header from '../components/Header'
import Constants from '../constants/Styles.js'
import { LANGS } from '../constants/Langs'

const LogIn = ({ navigation }) => {
    const dispatch = useDispatch();

    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const { selected: languageSelected } = useSelector(state => state.settings.language)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [logInLoading, setLogInLoading] = useState(false)

    const [modalVisible, setModalVisible] = useState(false);

    const [logInSuccess, setLogInSuccess] = useState(false)
    const [accountEmail, setAccountEmail] = useState("")

    const [logInError, setLogInError] = useState(false)
    const [validInput, setValidInput] = useState(false)

    const handleLogIn = () => {
        dispatch(logIn(email.trim(), password, setLogInError, setModalVisible, setLogInLoading, setValidInput, setLogInSuccess, setAccountEmail))
    }

    useEffect(() => {
        setText(LANGS.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.logIn} | PLAYGROUND`,
            headerShown: false
        })
    }, [text])

    useEffect(() => {
        email.length > 0 && password.length > 0 ? setValidInput(true) : setValidInput(false)
    }, [email, password])

    useFocusEffect(
        useCallback(() => {
            return () => {
                setEmail("");
                setPassword("");
            };
        }, [])
    )


    return (
        <>
            <Header navigation={navigation} />
            <View style={[styles.profileContainer, !darkMode && styles.colorDark, !darkMode && styles.backgroundWhite]}>
                <KeyboardAvoidingView style={[styles.itemsContainer, altColorTheme && styles.altItemsContainer]}>
                    <ScrollView>
                        <View style={styles.profileItem}>
                            <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.email}: </Text></Text>
                            <TextInput keyboardType='email-address' autoCapitalize='none' style={[styles.textInput, altColorTheme && styles.altTextInput]} value={email} onChangeText={email => setEmail(email)} onSubmitEditing={() => validInput && handleLogIn()} />
                        </View>
                        <View style={styles.profileItem}>
                            <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.password}: </Text></Text>
                            <TextInput secureTextEntry={true} autoCapitalize='none' style={[styles.textInput, altColorTheme && styles.altTextInput]} value={password} onChangeText={password => setPassword(password)} onSubmitEditing={() => validInput && handleLogIn()} />
                        </View>
                        <View style={styles.profileItem}>
                            <View style={styles.authItemTextWrapper}>
                                <TouchableOpacity style={[styles.authItemTextButton, altColorTheme && styles.altAuthItemTextButton, !validInput && { borderColor: 'darkgray' }, { height: 44 }]} disabled={!validInput || logInLoading} onPress={handleLogIn}>
                                    {logInLoading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <Text style={[styles.authItemText, !validInput && { color: 'darkgray' }]}>{text.logIn}</Text>}
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.authItemTextButton, altColorTheme && styles.altAuthItemTextButton, styles.authItemTextButtonRegister]} onPress={() => navigation.navigate("Auth", {screen: "SignUp"})}>
                                    <Text style={[styles.authItemText, styles.authItemTextRegister]}>{text.signUp}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
            <Modal visible={modalVisible} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <Text style={styles.modalTitle}>
                            <Text>{`ERROR: \n`}</Text>
                            <Text style={[styles.modalText, altColorTheme && styles.altModalText]}>{logInError === 'wrong_credentials' ? text.wrongCredentials : text.genericError}</Text>
                        </Text>
                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setModalVisible(false) }}>
                                <Text style={[styles.modalBtnText]}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
            <Modal visible={logInSuccess} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <Text style={styles.modalTitle}>
                            <Text>{`${text.welcome}\n`}</Text>
                            <Text style={[styles.modalText, altColorTheme && styles.altModalText]}>{accountEmail.toLocaleUpperCase()}</Text>
                        </Text>
                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setLogInSuccess(false); navigation.navigate("AppsHome") }}>
                                <Text style={[styles.modalBtnText]}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    )
}

export default LogIn


const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        backgroundColor: Constants.colorDark,
        justifyContent: 'center',
        alignItems: 'center',
        color: Constants.colorWhite,
        width: '100%',
        padding: 10,
        minHeight: 'auto'
    },
    itemsContainer: {
        width: '100%',
        minWidth: 300,
        maxWidth: 800,
        padding: 20,
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
    textInput: {
        backgroundColor: 'transparent',
        fontSize: Constants.fontMd,
        borderBottomColor: Constants.colorPrimaryDark,
        borderBottomWidth: 4,
        borderRadius: 4,
        padding: 4,
        width: '100%',
        color: Constants.colorWhite
    },
    altTextInput: {
        borderBottomColor: Constants.colorSecondaryDark,
    },
    authItemTextWrapper: {
        width: '100%',
        marginTop: 4,
        marginBottom: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authItemTextButton: {
        borderWidth: 2,
        borderRadius: 4,
        borderColor: Constants.colorWhite,
        backgroundColor: Constants.colorPrimaryDark,
        textAlign: 'center',
        marginInline: 4,
        padding: 8,
        color: Constants.colorDark,
        width: 180,
        justifyContent: 'center',
        alignItems: 'center'
    },
    altAuthItemTextButton: {
        backgroundColor: Constants.colorSecondaryDark,
    },
    authItemText: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
    },
    authItemTextRegister: {
        fontSize: Constants.fontSm,
        fontFamily: Constants.fontPrimary,
    },
    authItemTextButtonRegister: {
        alignSelf: 'flex-end',
        width: 140,
        borderWidth: 1,
        marginTop: 20
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
        textAlign: 'center',
        marginTop: 20,
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