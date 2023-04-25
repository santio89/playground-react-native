import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Constants from '../constants/Styles'
import { LANGS } from '../constants/Langs'
import Header from '../components/Header'
import { LinearGradient } from 'expo-linear-gradient';


const MainMenu = ({ navigation }) => {
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const { selected: languageSelected } = useSelector(state => state.settings.language)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

    const updateWindowWidth = () => {
        setWindowWidth(Dimensions.get('window').width)
    }

    useEffect(() => {
        const dimensionsHandler = Dimensions.addEventListener("change", updateWindowWidth)

        return () => {
            dimensionsHandler.remove()
        }
    })

    useEffect(() => {
        setText(LANGS.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.apps} | PLAYGROUND`,
            headerShown: false
        })
    }, [text])


    return (
        <>
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={[styles.menuWrapper, !darkMode && styles.backgroundWhite]}>
                <View style={[styles.menuContainer, !darkMode && styles.backgroundWhite, { flexDirection: windowWidth > 800 ? 'row' : 'column' }]}>
                    <View style={{ flex: 1, width: '100%', justifyContent: windowWidth > 800 ? 'center' : 'flex-end', alignItems: windowWidth > 800 ? 'stretch' : 'center' }}>
                        <TouchableOpacity style={[styles.menuOption, altColorTheme && styles.altMenuOption, { width: windowWidth > 800 ? 'auto' : (windowWidth > 320 ? 300 : '100%') }]} onPress={() => { navigation.navigate("ToDoList") }}>
                         {/*    <LinearGradient
                                colors={altColorTheme ? [Constants.colorSecondaryDark, Constants.colorSecondary, Constants.colorSecondaryDark] : [Constants.colorPrimaryDark, Constants.colorPrimary, Constants.colorPrimaryDark]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: -0.5, y: -0.5 }}
                                style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, zIndex: -1 }}
                            /> */}
                            <Text style={[styles.menuOptionText]}>{text.toDoList}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuOption, altColorTheme && styles.altMenuOption, { width: windowWidth > 800 ? 'auto' : (windowWidth > 320 ? 300 : '100%') }]} onPress={() => { navigation.navigate("MemoGame") }}>

                            <Text style={[styles.menuOptionText]}>{text.memoGame}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, width: '100%', justifyContent: windowWidth > 800 ? 'center' : 'flex-start', alignItems: windowWidth > 800 ? 'stretch' : 'center' }}>
                        <TouchableOpacity style={[styles.menuOption, altColorTheme && styles.altMenuOption, { width: windowWidth > 800 ? 'auto' : (windowWidth > 320 ? 300 : '100%') }]} onPress={() => { navigation.navigate("Weather") }}>

                            <Text style={[styles.menuOptionText]}>{text.weather}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menuOption, altColorTheme && styles.altMenuOption, { width: windowWidth > 800 ? 'auto' : (windowWidth > 320 ? 300 : '100%') }]} onPress={() => { navigation.navigate("Calculator") }}>

                            <Text style={[styles.menuOptionText]}>{text.calculator}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

export default MainMenu


const styles = StyleSheet.create({
    menuWrapper: {
        width: '100%',
        backgroundColor: Constants.colorDark,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    menuContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 800,
        minHeight: 200,
        flex: 1,
        backgroundColor: Constants.colorDark,
    },
    menuOption: {
        padding: 20,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        margin: 20,
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 400,
        maxHeight: 120,
        height: 110,
    },
    menuOptionText: {
        fontSize: Constants.fontLg,
        fontFamily: Constants.fontPrimaryBold,
        color: Constants.colorWhite,
    },
    /* for dark mode off */
    backgroundWhite: {
        backgroundColor: Constants.colorWhite
    },
    /* for alt color theme */
    altMenuOption: {
        borderColor: Constants.colorSecondaryDark,
        backgroundColor: Constants.colorSecondary,
    },
})