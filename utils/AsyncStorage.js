import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'


export const storageSetItem = Platform.OS === 'web' ?
    async (name, items) => {
        localStorage.setItem(name, items);
    } :
    async (name, items) => {
        await AsyncStorage.setItem(name, items);
    }

export const storageGetItem = Platform.OS === 'web' ?
    async (name) => {
        return localStorage.getItem(name);
    } :
    async (name) => {
        return await AsyncStorage.getItem(name);
    }


