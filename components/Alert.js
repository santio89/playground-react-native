/* fix alert para web */
import { Alert, Platform } from 'react-native'

const alertPolyfill = (title, description, options, extra) => {
    const result = window.confirm([title, description].filter(Boolean).join('\n'))

    if (result) {
        const confirmOption = options.find(({ text }) => text.toLowerCase() === 'eliminar')
        confirmOption && confirmOption.onPress()
    } else {
        return;
    }
}

const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert

export default alert


