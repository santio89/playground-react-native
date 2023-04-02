import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useSelector } from 'react-redux/es/exports'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Constants from '../constants/Styles.js'

const SignUp = ({ navigation }) => {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const { selected: languageSelected, langs } = useSelector(state => state.settings.language)

    const [text, setText] = useState(langs.find(lang => lang.lang === languageSelected).text)

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [validEmail, setValidEmail] = useState(true)
    const [validPassword, setValidPassword] = useState(true)
    const [validInputs, setValidInputs] = useState(false);

    const validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    const validatePassword = (password) => {
        var re = /^(?=.*\d).{8,}$/;
        return re.test(password);
    };

    useEffect(() => {
        setText(langs.find(lang => lang.lang === languageSelected).text)
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
        validateEmail(email) && validatePassword(password) ? setValidInputs(true) : setValidInputs(false)
    }, [email, password])


    return (
        <>
            <Header navigation={navigation} />
            <KeyboardAwareScrollView contentContainerStyle={[styles.profileContainer, !darkMode && styles.colorDark, !darkMode && styles.backgroundWhite]}>
                <View style={[styles.itemsContainer, altColorTheme && styles.altItemsContainer]}>
                    <View style={styles.profileItem}>
                        <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator, !validEmail && { color: Constants.colorRed }]}>●&nbsp;</Text><Text style={!validEmail && { color: Constants.colorRed }}>{text.email}: </Text></Text>
                        <TextInput keyboardType='email-address' autoCapitalize='none' style={[styles.textInput, altColorTheme && styles.altTextInput, !validEmail && { borderBottomColor: Constants.colorRed }]} value={email} onChangeText={email => setEmail(email)} placeholder={text.minEmail} placeholderTextColor={altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark} />
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator, !validPassword && { color: Constants.colorRed }]}>●&nbsp;</Text><Text style={!validPassword && { color: Constants.colorRed }}>{text.password}: </Text></Text>
                        <TextInput style={[styles.textInput, altColorTheme && styles.altTextInput, !validPassword && { borderBottomColor: Constants.colorRed }]} autoCapitalize='none' secureTextEntry={true} placeholder={text.minPassword}
                            placeholderTextColor={altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark} value={password} onChangeText={password => setPassword(password)} />
                    </View>
                    <View style={styles.profileItem}>
                        <View style={styles.authItemTextWrapper}>
                            <TouchableOpacity style={[styles.authItemTextButton, altColorTheme && styles.altAuthItemTextButton, !validInputs && { borderColor: 'darkgray' }]} disabled={!validInputs}>
                                <Text style={[styles.authItemText, !validInputs && { color: 'darkgray' }]}>{text.signUp}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.authItemTextButton, altColorTheme && styles.altAuthItemTextButton, styles.authItemTextButtonRegister]} onPress={() => navigation.navigate("LogIn")}>
                                <Text style={[styles.authItemText, styles.authItemTextRegister]}>{text.logIn}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
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
        padding: 10
    },
    itemsContainer: {
        width: '100%',
        minWidth: 300,
        maxWidth: 800,
        padding: 20,
        paddingBottom: 0,
        backgroundColor: Constants.colorPrimary,
        borderRadius: 8,
        borderWidth: 4,
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
        width: 180
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
})