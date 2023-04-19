import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Constants from '../constants/Styles'
import { LANGS } from '../constants/Langs.js';
import CalcKeyboard from '../components/CalcKeyboard';

const Calculator = ({ navigation }) => {
    const { language } = useSelector(state => state.settings)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === language.selected).text)

    useEffect(() => {
        setText(LANGS.find(lang => lang.lang === language.selected).text)
    }, [language.selected])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.calculator} | PLAYGROUND`,
        })
    }, [text])


    return (
        <>
            <View style={[styles.calcAppContainer, !darkMode && styles.altCalcAppContainer]}>
                <ScrollView contentContainerStyle={styles.calcAppWrapper}>
                    <CalcKeyboard />
                </ScrollView>
            </View>
        </>
    )
}

export default Calculator

const styles = StyleSheet.create({
    calcAppContainer: {
        flex: 1,
        backgroundColor: Constants.colorDark,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        width: '100%'
    },
    calcAppWrapper: {
      width: '100%',
      minWidth: 300,
      maxWidth: 800,
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    
  /* for dark mode off */
  altCalcAppContainer: {
    backgroundColor: Constants.colorWhite,
  },
})