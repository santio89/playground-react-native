import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Constants from '../constants/Styles'
import CalcButton from './CalcButton'


const CalcKeyboard = () => {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)

    const [firstNumber, setFirstNumber] = useState("")
    const [secondNumber, setSecondNumber] = useState("")
    const [operation, setOperation] = useState("")
    const [result, setResult] = useState(null)

    const handleNumberPress = (btnVal) => {
        if (firstNumber.length < 10) {
            setFirstNumber(firstNumber + btnVal)
        }
    }

    const handleOperationPress = (btnVal) => {
        setOperation(btnVal)
        setSecondNumber(firstNumber)
        setFirstNumber("")
    }

    const clearScreen = () => {
        setFirstNumber("")
        setSecondNumber("")
        setOperation("")
        setResult(null)
    }

    const getResult = () => {
        switch (operation) {
            case "+":
                clearScreen()
                setResult(Number(secondNumber) + Number(firstNumber))
                break;
            case "-":
                clearScreen()
                setResult(Number(secondNumber) - Number(firstNumber))
                break;
            case "*":
                clearScreen()
                setResult(Number(secondNumber) * Number(firstNumber))
                break;
            case "/":
                clearScreen()
                setResult(Number(secondNumber) / Number(firstNumber))
                break;
            default: 
                clearScreen()
                setResult(0)
                break;
        }
    }


    return (
        <View></View>
    )
}

export default CalcKeyboard

const styles = StyleSheet.create({
})