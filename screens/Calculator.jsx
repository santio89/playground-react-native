import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Constants from '../constants/Styles'
import { LANGS } from '../constants/Langs.js';

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
           <Text>CALC</Text>
        </>
    )
}

export default Calculator

const styles = StyleSheet.create({
})