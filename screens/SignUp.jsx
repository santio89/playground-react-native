import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Modal, SafeAreaView, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import Constants from '../constants/Styles.js'
import { LANGS } from '../constants/Langs'
import { signUp } from '../store/actions/auth.action'
import { setSettingsFirebase } from '../store/actions/settings.action'
import { setListItems, setMemoScore } from '../store/actions/apps.action'

const SignUp = ({ navigation }) => {
    const dispatch = useDispatch()

    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const { selected: languageSelected } = useSelector(state => state.settings.language)

    const settings = useSelector(state => state.settings)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("")

    const [modalVisible, setModalVisible] = useState(false);
    const [emailError, setEmailError] = useState(false)

    const [accountCreatedModal, setAccountCreatedModal] = useState(false)
    const [accountEmail, setAccountEmail] = useState("")

    const [signUpLoading, setSignUpLoading] = useState(false)

    const [validEmail, setValidEmail] = useState(true)
    const [validPassword, setValidPassword] = useState(true)
    const [validName, setValidName] = useState(true)
    const [validInputs, setValidInputs] = useState(false);

    const validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        var re = /[^ ]{8,16}/;
        return re.test(password);
    };

    const validateName = (name) => {
        var re = /[^ ]{4,16}/;
        return re.test(name);
    };

    const handleSignUp = () => {
        dispatch(signUp(email.trim(), password, `🦊${displayName.trim()}`, setEmailError, setModalVisible, setSignUpLoading, setValidInputs, setAccountCreatedModal, setAccountEmail, settings, setSettingsFirebase, setListItems, setMemoScore))
    }

    useEffect(() => {
        setText(LANGS.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.signUp} | PLAYGROUND`,
            headerShown: false
        })
    }, [text])


    useEffect(() => {
        validateEmail(email) || email === "" ? setValidEmail(true) : setValidEmail(false)
    }, [email])
    useEffect(() => {
        validatePassword(password) || password === "" ? setValidPassword(true) : setValidPassword(false)
    }, [password])
    useEffect(() => {
        validateName(displayName) || displayName === "" ? setValidName(true) : setValidName(false)
    }, [displayName])

    useEffect(() => {
        validateEmail(email) && validatePassword(password) && validateName(displayName) ? setValidInputs(true) : setValidInputs(false)
    }, [email, password, displayName])

    useFocusEffect(
        useCallback(() => {
            return () => {
                setEmail("");
                setPassword("");
                setDisplayName("")
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
                            <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator, !validEmail && { color: Constants.colorRed }]}>●&nbsp;</Text><Text style={!validEmail && { color: Constants.colorRed }}>{text.email}: </Text></Text>
                            <TextInput keyboardType='email-address' autoCapitalize='none' style={[styles.textInput, altColorTheme && styles.altTextInput, !validEmail && { borderBottomColor: Constants.colorRed }]} value={email} onChangeText={email => setEmail(email)} onSubmitEditing={() => validInputs && handleSignUp()} placeholder={text.minEmail} placeholderTextColor={altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark} />
                        </View>
                        <View style={styles.profileItem}>
                            <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator, !validPassword && { color: Constants.colorRed }]}>●&nbsp;</Text><Text style={!validPassword && { color: Constants.colorRed }}>{text.password}: </Text></Text>
                            <TextInput style={[styles.textInput, altColorTheme && styles.altTextInput, !validPassword && { borderBottomColor: Constants.colorRed }]} autoCapitalize='none' secureTextEntry={true} placeholder={text.minPassword}
                                placeholderTextColor={altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark} value={password} onChangeText={password => setPassword(password)} onSubmitEditing={() => validInputs && handleSignUp()} />
                        </View>
                        <View style={styles.profileItem}>
                            <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator, !validName && { color: Constants.colorRed }]}>●&nbsp;</Text><Text style={!validName && { color: Constants.colorRed }}>{text.name}: </Text></Text>
                            <TextInput style={[styles.textInput, altColorTheme && styles.altTextInput, !validName && { borderBottomColor: Constants.colorRed }]} autoCapitalize='none' placeholder={text.minName}
                                placeholderTextColor={altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark} value={displayName} onChangeText={displayName => setDisplayName(displayName)} onSubmitEditing={() => validInputs && handleSignUp()} />
                        </View>
                        <View style={styles.profileItem}>
                            <View style={styles.authItemTextWrapper}>
                                <TouchableOpacity style={[styles.authItemTextButton, altColorTheme && styles.altAuthItemTextButton, !validInputs && { borderColor: 'darkgray' }, { height: 44 }]} disabled={!validInputs || signUpLoading} onPress={handleSignUp}>
                                    {signUpLoading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <Text style={[styles.authItemText, !validInputs && { color: 'darkgray' }]}>{text.signUp}</Text>}

                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.authItemTextButton, altColorTheme && styles.altAuthItemTextButton, styles.authItemTextButtonRegister]} onPress={() => navigation.navigate("LogIn")}>
                                    <Text style={[styles.authItemText, styles.authItemTextRegister]}>{text.logIn}</Text>
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
                            <Text style={[styles.modalText, altColorTheme && styles.altModalText]}>{emailError === 'email_exists' ? text.emailExists : (emailError === 'blocked_requests' ? text.blockedRequests : text.genericError)}</Text>
                        </Text>
                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setModalVisible(false) }}>
                                <Text style={[styles.modalBtnText]}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
            <Modal visible={accountCreatedModal} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <Text style={[styles.modalTitle]}>
                            <Text>{`${text.createdAccount}: \n`}</Text>
                            <Text style={[styles.modalText, altColorTheme && styles.altModalText]}>{accountEmail.toLocaleUpperCase()}</Text>
                        </Text>
                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setAccountCreatedModal(false); navigation.navigate("Auth", {screen: "LogIn"}); navigation.navigate("AppsHome") }}>
                                <Text style={[styles.modalBtnText]}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    )
}

export default SignUp


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
    altModalText: {
        backgroundColor: Constants.colorSecondaryDark,
    },
})