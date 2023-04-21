import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import Constants from '../constants/Styles'
import CalcButton from './CalcButton'


const CalcKeyboard = () => {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)

    const [firstNumber, setFirstNumber] = useState("")
    const [secondNumber, setSecondNumber] = useState("")
    const [operation, setOperation] = useState("")
    const [result, setResult] = useState(null)

    const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);

    const updateWindowHeight = () => {
        setWindowHeight(Dimensions.get('window').height)
    }

    const handleNumberPress = (btnVal) => {
        if (result) {
            return
        }

        if (btnVal === "0" && firstNumber === "") {
            return
        }

        if (firstNumber.length < 10) {
            firstNumber === "" || firstNumber === "0" ? setFirstNumber(btnVal) : setFirstNumber(firstNumber + btnVal)
        }
    }

    const handleOperationPress = (btnVal) => {
        if ((result === Infinity || isNaN(result) || operation !== "")) {
            return
        }

        setOperation(btnVal)
        if (result) {
            setSecondNumber(result > 999999999 ? result?.toExponential(2) : result.toString())
            setResult(null)
        } else {
            if (secondNumber === "") {
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
        result ? setResult(result => (-1) * Number(result)) : (setFirstNumber(firstNumber => (-1 * Number(firstNumber)).toString()))
    }

    const handlePercent = () => {
        result ? setResult(result => ((1 / 100) * Number(result)).toFixed(2)) : (setFirstNumber(firstNumber => (((1 / 100) * Number(firstNumber)).toFixed(2)).toString()))
    }

    const handleDelete = () => {
        if (firstNumber !== "" && firstNumber !== "0") {
            setFirstNumber(firstNumber => firstNumber.slice(0, -1))
        } else if (operation !== "") {
            setOperation("");
            setFirstNumber(secondNumber);
            setSecondNumber("")
        }
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
                setResult(result ? result : (secondNumber ? Number(secondNumber) : (firstNumber ? Number(firstNumber) : 0)))
                break;
        }
    }

    const firstNumberDisplay = () => {
        if (result !== null) {
            return <Text style={[styles.screenFirstNumber, { fontFamily: Constants.fontPrimaryBold, color: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark }, result.toLocaleString('en-US', 8).length > 6 && { fontSize: 40 }, result.toLocaleString('en-US', 8).length > 12 && { fontSize: 34 }, result.toLocaleString('en-US', 8).length > 14 && { fontSize: 30 }, result > 999999999 && { fontSize: 40 }]}>{result === Infinity || isNaN(result) ? "ERROR" : (result > 999999999 ? result?.toExponential(2).toLocaleString('en-US', 8) : result?.toLocaleString('en-US', 8))}</Text>;
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
        if (firstNumber.length > 8 && firstNumber.length < 11) {
            return (
                <Text style={[styles.screenFirstNumber, { fontSize: 40 }]}>
                    {firstNumber}
                </Text>
            );
        }
        if (firstNumber.length > 10) {
            return (
                <Text style={[styles.screenFirstNumber, { fontSize: 40 }]}>
                    {Number(firstNumber).toExponential(2).toLocaleString('en-US', 8)}
                </Text>
            );
        }
    };

    useEffect(() => {
        const dimensionsHandler = Dimensions.addEventListener("change", updateWindowHeight)

        return () => {
            dimensionsHandler.remove()
        }
    })



    return (
        <View style={[styles.calcKeyboard, altColorTheme && styles.altCalcKeyboard, , windowHeight < 620 && { padding: 6 }]}>
            <View style={styles.calcScreen}>
                <Text style={styles.screenSecondNumber}>
                    {secondNumber.toLocaleString('en-US', 8)}
                    <Text style={{ color: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, marginHorizontal: 4, fontFamily: Constants.fontPrimaryBold, fontSize: Constants.fontXl }}>{operation}</Text>
                </Text>
                {firstNumberDisplay()}
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"C"} onPress={() => clearScreen()} bgColor={"darkgray"} />
                <CalcButton title={"+/-"} onPress={() => handleInvert()} bgColor={"darkgray"} />
                <CalcButton title={"%"} onPress={() => handlePercent()} bgColor={"darkgray"} />
                <CalcButton opacity={operation !== "" ? .4 : 1} disabled={operation !== "" ? true : false} title={"÷"} onPress={() => handleOperationPress("/")} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"7"} onPress={() => handleNumberPress("7")} bgColor={"dimgray"} />
                <CalcButton title={"8"} onPress={() => handleNumberPress("8")} bgColor={"dimgray"} />
                <CalcButton title={"9"} onPress={() => handleNumberPress("9")} bgColor={"dimgray"} />
                <CalcButton opacity={operation !== "" ? .4 : 1} disabled={operation !== "" ? true : false} title={"×"} onPress={() => handleOperationPress("*")} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"4"} onPress={() => handleNumberPress("4")} bgColor={"dimgray"} />
                <CalcButton title={"5"} onPress={() => handleNumberPress("5")} bgColor={"dimgray"} />
                <CalcButton title={"6"} onPress={() => handleNumberPress("6")} bgColor={"dimgray"} />
                <CalcButton opacity={operation !== "" ? .4 : 1} disabled={operation !== "" ? true : false} title={"-"} onPress={() => handleOperationPress("-")} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"1"} onPress={() => handleNumberPress("1")} bgColor={"dimgray"} />
                <CalcButton title={"2"} onPress={() => handleNumberPress("2")} bgColor={"dimgray"} />
                <CalcButton title={"3"} onPress={() => handleNumberPress("3")} bgColor={"dimgray"} />
                <CalcButton opacity={operation !== "" ? .4 : 1} disabled={operation !== "" ? true : false} title={"+"} onPress={() => handleOperationPress("+")} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
            <View style={styles.calcRow}>
                <CalcButton title={"."} onPress={() => handleNumberPress(".")} bgColor={"dimgray"} />
                <CalcButton title={"0"} onPress={() => handleNumberPress("0")} bgColor={"dimgray"} />
                <CalcButton title={"⌫"} onPress={() => handleDelete()} bgColor={"dimgray"} />
                <CalcButton title={"="} onPress={() => getResult()} bgColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            </View>
        </View>
    )
}

export default CalcKeyboard

const styles = StyleSheet.create({
    calcKeyboard: {
        width: '100%',
        minWidth: 340,
        maxWidth: 380,
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

        shadowColor: Constants.colorWhite,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4.00,
        elevation: 8,
    },
    screenFirstNumber: {
        fontFamily: Constants.fontPrimary,
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