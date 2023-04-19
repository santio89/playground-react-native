import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import Constants from '../constants/Styles'
import CalcButton from './CalcButton'


const CalcKeyboard = () => {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)

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
        if ((result === Infinity || isNaN(result))){
            return
        }

        setOperation(btnVal)
        if (result) {
            setSecondNumber(result > 999999999999 ? result?.toExponential(2) : result)
            setResult(null)
        } else {
            if (secondNumber) {
                getResult()
            } else {
                setSecondNumber(firstNumber)
                setFirstNumber("")
            }
        }
    }

    const clearScreen = () => {
        setFirstNumber("")
        setSecondNumber("")
        setOperation("")
        setResult(null)
    }

    const handleInvert = () => {
        result ? setResult((-1) * Number(result)) : (setFirstNumber((-1 * Number(firstNumber)).toString()))
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
                setResult(result?result:(firstNumber?Number(firstNumber):0))
                break;
        }
    }

    const firstNumberDisplay = () => {
        if (result !== null) {
            return <Text style={[styles.screenFirstNumber, { fontFamily: Constants.fontPrimaryBold, color: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark }, result.toString().length > 7 && { fontSize: 40 }, result.toString().length > 10 && { fontSize: 34 }, result.toString().length > 12 && { fontSize: 30 }, result.toString().length > 14 && { fontSize: 28 }, result > 999999999999 && { fontSize: 40 }]}>{result === Infinity || isNaN(result) ? "ERROR":(result > 999999999999 ? result?.toExponential(2).toLocaleString('en-US', 8) : result?.toLocaleString('en-US', 8))}</Text>;
        }
        if (firstNumber && firstNumber.length < 7) {
            return <Text style={styles.screenFirstNumber}>{firstNumber}</Text>;
        }
        if (firstNumber === "") {
            return <Text style={styles.screenFirstNumber}>{"0"}</Text>;
        }
        if (firstNumber.length > 6 && firstNumber.length < 9) {
            return (
                <Text style={[styles.screenFirstNumber, { fontSize: 50 }]}>
                    {firstNumber}
                </Text>
            );
        }
        if (firstNumber.length > 7) {
            return (
                <Text style={[styles.screenFirstNumber, { fontSize: 40 }]}>
                    {firstNumber}
                </Text>
            );
        }
    };


    return (
        <View style={[styles.calcKeyboard, altColorTheme && styles.altCalcKeyboard]}>
            <View style={styles.calcScreen}>
                <Text style={styles.screenSecondNumber}>
                    {secondNumber}
                    <Text style={{ color: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, marginHorizontal: 4, fontFamily: Constants.fontPrimaryBold, fontSize: Constants.fontXl }}>{operation}</Text>
                </Text>
                {firstNumberDisplay()}
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"C"} onPress={() => clearScreen()} bgColor={"darkgray"} />
                <CalcButton title={"+/-"} onPress={() => handleInvert()} bgColor={"darkgray"} />
                <CalcButton title={"%"} onPress={() => handleOperationPress("%")} bgColor={"darkgray"} disabled />
                <CalcButton title={"÷"} onPress={() => handleOperationPress("/")} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"7"} onPress={() => handleNumberPress("7")} bgColor={"dimgray"} />
                <CalcButton title={"8"} onPress={() => handleNumberPress("8")} bgColor={"dimgray"} />
                <CalcButton title={"9"} onPress={() => handleNumberPress("9")} bgColor={"dimgray"} />
                <CalcButton title={"×"} onPress={() => handleOperationPress("*")} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"4"} onPress={() => handleNumberPress("4")} bgColor={"dimgray"} />
                <CalcButton title={"5"} onPress={() => handleNumberPress("5")} bgColor={"dimgray"} />
                <CalcButton title={"6"} onPress={() => handleNumberPress("6")} bgColor={"dimgray"} />
                <CalcButton title={"-"} onPress={() => handleOperationPress("-")} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"1"} onPress={() => handleNumberPress("1")} bgColor={"dimgray"} />
                <CalcButton title={"2"} onPress={() => handleNumberPress("2")} bgColor={"dimgray"} />
                <CalcButton title={"3"} onPress={() => handleNumberPress("3")} bgColor={"dimgray"} />
                <CalcButton title={"+"} onPress={() => handleOperationPress("+")} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"."} onPress={() => handleNumberPress(".")} bgColor={"dimgray"} />
                <CalcButton title={"0"} onPress={() => handleNumberPress("0")} bgColor={"dimgray"} />
                <CalcButton title={"⌫"} onPress={() => setFirstNumber(firstNumber.slice(0, -1))} bgColor={"dimgray"} />
                <CalcButton title={"="} onPress={() => getResult()} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
        </View>
    )
}

export default CalcKeyboard

const styles = StyleSheet.create({
    calcKeyboard: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderRadius: 12,
        borderColor: Constants.colorPrimary,
        padding: 12,
        backgroundColor: Constants.colorPrimaryDark,
    },
    calcRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    calcScreen: {
        backgroundColor: 'gray',
        width: '100%',
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
        minWidth: 292,
        minHeight: 152,
        justifyContent: 'flex-end',
        borderWidth: 1,
        borderColor: Constants.colorWhite,
    },
    screenFirstNumber: {
        fontFamily: Constants.fontPrimary,
        fontSize: 96,
        fontSize: Constants.fontXll,
        color: Constants.colorWhite,
        alignSelf: "flex-end",
        width: '100%',
        textAlign: 'right',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    screenSecondNumber: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontLgg,
        color: Constants.colorWhite,
        alignSelf: "flex-end",
        width: '100%',
        textAlign: 'right',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    /* for alt color theme */
    altCalcKeyboard: {
        backgroundColor: Constants.colorSecondaryDark,
        borderColor: Constants.colorSecondary,
    },
})