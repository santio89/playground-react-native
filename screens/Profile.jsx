import { StyleSheet, Text, ScrollView, View, Image } from 'react-native'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Constants from '../constants/Styles.js'
import Header from '../components/Header'

const Profile = ({ navigation }) => {
    /* estado de prueba */
    const [user, setUser] = useState({
        email: "TEST@GMAIL.COM",
        nombre: "TEST",
        avatar: "https://source.unsplash.com/random/"
    })

    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const { selected: languageSelected, langs } = useSelector(state => state.settings.language)

    const [text, setText] = useState(langs.find(lang => lang.lang === languageSelected).text)

    useEffect(() => {
        setText(langs.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.profile} | PLAYGROUND`,
            headerShown: false
        })
    }, [text])

    return (
        <>
            <Header navigation={navigation}/>
            <ScrollView contentContainerStyle={[styles.profileContainer, !darkMode && styles.colorDark, !darkMode && styles.backgroundWhite]}>
                <View style={[styles.itemsContainer, altColorTheme && styles.altItemsContainer]}>
                    <View style={styles.profileItem}>
                        <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.email}: </Text></Text>
                        <Text style={[styles.profileItemText]}>{user.email}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.name}: </Text></Text>
                        <Text style={[styles.profileItemText]}>{user.nombre}</Text>
                    </View>
                    <View style={styles.profileItem}>
                        <Text style={[styles.profileItemLabel]}><Text style={[styles.profileItemIndicator, altColorTheme && styles.altProfileItemIndicator]}>●&nbsp;</Text><Text>{text.avatar}: </Text></Text>
                        <Image
                            style={styles.profileItemImage}
                            source={{ uri: user.avatar }}
                        />
                    </View>
                </View>
            </ScrollView>
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