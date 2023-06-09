import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
import Constants from '../constants/Styles'
import { useState, useEffect } from 'react'

const CalcButton = ({ title, onPress, bgColor, ...props }) => {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)

    const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);

    const updateWindowHeight = () => {
        setWindowHeight(Dimensions.get('window').height)
    }

    useEffect(() => {
        const dimensionsHandler = Dimensions.addEventListener("change", updateWindowHeight)

        return () => {
            dimensionsHandler.remove()
        }
    })


    return (
        <TouchableOpacity style={[styles.calcButton, { backgroundColor: bgColor }, { opacity: props.opacity ? props.opacity : 1 }, windowHeight < 620 && {maxHeight: 48}]} onPress={onPress} disabled={props.disabled}>
            <Text style={[styles.calcButtonText]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CalcButton

const styles = StyleSheet.create({
    calcButton: {
        flex: 1,
        aspectRatio: 3/2,
        backgroundColor: Constants.colorDark,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4.00,
        elevation: 8,
    },
    calcButtonText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontLg,
        color: Constants.colorWhite,
    }
})