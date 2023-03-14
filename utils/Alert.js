/* fix alert para web */
import { Alert, Platform } from 'react-native'

const alertPolyfill = (title, description, options) => {
    const result = window.confirm([title, description].filter(Boolean).join('\n'))

    if (result) {
        const confirmOption = options.find(({ text }) => text.toLowerCase() === 'eliminar')
        confirmOption && confirmOption.onPress()
    } else {
        const cancelOption = options.find(({ text }) => text.toLowerCase() !== 'eliminar')
        cancelOption && cancelOption.onPress()
        return;
    }
}

const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert

export default alert


