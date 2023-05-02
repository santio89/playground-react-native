import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Constants from '../constants/Styles'
import { LANGS } from '../constants/Langs'
import Header from '../components/Header'
import { LinearGradient } from 'expo-linear-gradient'


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
            <View style={[styles.menuWrapper, !darkMode && styles.backgroundWhite]}>
                <ScrollView contentContainerStyle={[styles.menuContainer, !darkMode && styles.backgroundWhite, { paddingVertical: 16 }]}>
                    <View style={[{ width: '100%', maxWidth: 800, margin: 'auto', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }, { flexDirection: windowWidth > 800 ? 'row' : 'column' }]}>
                        <View style={[styles.menuOptionWrapper, { margin: windowWidth < 800 ? 10 : 20 }]}>
                            <TouchableOpacity style={[styles.menuOption, altColorTheme && styles.altMenuOption, { width: (windowWidth > 320 ? 320 : 280) }]} onPress={() => { navigation.navigate("ToDoList") }}>
                                <LinearGradient
                                    colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? Constants.colorSecondary : Constants.colorPrimary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    locations={[0.1, 0.1]}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, borderTopEndRadius: 8, borderBottomEndRadius: 8, zIndex: -1 }}
                                />
                                <Text style={[styles.menuOptionText]}>{text.toDoList}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.menuOptionWrapper, { margin: windowWidth < 800 ? 10 : 20 }]}>
                            <TouchableOpacity style={[styles.menuOption, altColorTheme && styles.altMenuOption, { width: (windowWidth > 320 ? 320 : 280) }]} onPress={() => { navigation.navigate("MemoGame") }}>
                                <LinearGradient
                                    colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? Constants.colorSecondary : Constants.colorPrimary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    locations={[0.1, 0.1]}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, borderTopEndRadius: 8, borderBottomEndRadius: 8, zIndex: -1 }}
                                />
                                <Text style={[styles.menuOptionText]}>{text.memoGame}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.menuOptionWrapper, { margin: windowWidth < 800 ? 10 : 20 }]}>
                            <TouchableOpacity style={[styles.menuOption, altColorTheme && styles.altMenuOption, { width: (windowWidth > 320 ? 320 : 280) }]} onPress={() => { navigation.navigate("Weather") }}>
                                <LinearGradient
                                    colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? Constants.colorSecondary : Constants.colorPrimary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    locations={[0.1, 0.1]}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, borderTopEndRadius: 8, borderBottomEndRadius: 8, zIndex: -1 }}
                                />
                                <Text style={[styles.menuOptionText]}>{text.weather}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.menuOptionWrapper, { margin: windowWidth < 800 ? 10 : 20 }]}>
                            <TouchableOpacity style={[styles.menuOption, altColorTheme && styles.altMenuOption, { width: (windowWidth > 320 ? 320 : 280) }]} onPress={() => { navigation.navigate("Calculator") }}>
                                <LinearGradient
                                    colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? Constants.colorSecondary : Constants.colorPrimary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    locations={[0.1, 0.1]}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, borderTopEndRadius: 8, borderBottomEndRadius: 8, zIndex: -1 }}
                                />
                                <Text style={[styles.menuOptionText]}>{text.calculator}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.menuOptionWrapper, { margin: windowWidth < 800 ? 10 : 20 }, { width: '100%', maxWidth: 720 }]}>
                            <TouchableOpacity style={[styles.menuOption, altColorTheme && styles.altMenuOption, { width: (windowWidth > 320 ? (windowWidth < 800 ? 320 : '100%') : 280), maxWidth: 720 }]} onPress={() => { navigation.navigate("Album") }}>
                                <LinearGradient
                                    colors={[altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, altColorTheme ? Constants.colorSecondary : Constants.colorPrimary]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    locations={[0.1, 0.1]}
                                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 4, borderTopEndRadius: 8, borderBottomEndRadius: 8, zIndex: -1 }}
                                />
                                <Text style={[styles.menuOptionText]}>{text.album}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </View >
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
        flexGrow: 1,
        backgroundColor: Constants.colorDark,
    },
    menuOptionWrapper: {
        flexGrow: 1,
        maxHeight: 80,
        minHeight: 80,
        height: 80, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    menuOption: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        textAlign: 'right',
        maxWidth: 400,
        height: 80,
        minHeight: 80,
        maxHeight: 80,
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