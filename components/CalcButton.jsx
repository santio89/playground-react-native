import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import Constants from '../constants/Styles'

const CalcButton = ({title, onPress, bgColor, ...props}) => {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)


  return (
    <TouchableOpacity style={[styles.calcButton, {backgroundColor: bgColor}]} onPress={onPress} disabled={props.disabled}>
        <Text style={[styles.calcButtonText]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CalcButton

const styles = StyleSheet.create({
    calcButton: {
        width: 60,
        aspectRatio: 1,
        backgroundColor: Constants.colorDark,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        padding: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Constants.colorWhite,
        shadowColor: 'gray',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 8.00,
        elevation: 8,
    },
    calcButtonText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontLg,
        color: Constants.colorWhite,
    }
})