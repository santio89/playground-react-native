import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Constants from '../constants/Styles'
import Header from '../components/Header'


const MainMenu = ({ navigation }) => {
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    const languageSelected = useSelector(state=>state.languages.selected)
    const langs = useSelector(state=>state.languages.langs)

    const [text, setText] = useState(langs.find(lang=>lang.lang === languageSelected).text)

    const updateWindowWidth = () => {
        setWindowWidth(Dimensions.get('window').width)
    }

    useEffect(() => {
        const dimensionsHandler = Dimensions.addEventListener("change", updateWindowWidth)

        return () => {
            dimensionsHandler.remove()
        }
    })
    
    useEffect(()=>{
        setText(langs.find(lang=>lang.lang === languageSelected).text)
    }, [languageSelected])

    return (
        <>
            <Header />
            <ScrollView contentContainerStyle={styles.menuWrapper}>
                <View style={[styles.menuContainer, { flexDirection: windowWidth > 800 ? 'row' : 'column' }]}>
                    <TouchableOpacity style={[styles.menuOption, { width: windowWidth > 800 ? 'auto' : (windowWidth > 320 ? 300 : '100%') }]} onPress={() => { navigation.navigate("ToDoList") }}>
                        <Text style={styles.menuOptionText}>{text.toDoList}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuOption, { width: windowWidth > 800 ? 'auto' : (windowWidth > 320 ? 300 : '100%') }]} onPress={() => { navigation.navigate("MemoGame") }}>
                        <Text style={styles.menuOptionText}>{text.memoGame}</Text>
                    </TouchableOpacity>
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
        borderWidth: 4,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        margin: 20,
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 400,
        maxHeight: 100
    },
    menuOptionText: {
        fontSize: Constants.fontLg,
        fontFamily: Constants.fontPrimaryBold,
        color: Constants.colorWhite,
    }
})