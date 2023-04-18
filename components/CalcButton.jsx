import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import Constants from '../constants/Styles'

const CalcButton = ({title, onPress, bgColor}) => {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)


  return (
    <TouchableOpacity style={[styles.calcButton, {backgroundColor: bgColor}]} onPress={onPress}>
        <Text style={[styles.calcButtonText]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CalcButton

const styles = StyleSheet.create({
    calcButton: {
        width: 50,
        aspectRatio: 1,
        backgroundColor: Constants.colorDark,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
        padding: 4,
        borderWidth: 1,
        borderColor: Constants.colorWhite,
    },
    calcButtonText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontLg,
        color: Constants.colorWhite,
    }
})