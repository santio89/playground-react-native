import { useEffect, useState } from 'react'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux';
import Constants from '../constants/Styles'
import { MaterialIcons } from '@expo/vector-icons';

export default function ListItem({ index, userId, items, setItems, dispatch, setListItems, storageSetItem, item, modalVisible, setModalVisible }) {
    const [itemComplete, setItemComplete] = useState(item.completed);
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)

    const toggleItemComplete = () => {
        item.completed = !itemComplete
        items[index].completed = !itemComplete
        setItemComplete(itemComplete => !itemComplete)
        setItems(items)
        dispatch(setListItems(userId, items, storageSetItem))
    }

    return (
        <View style={styles.listItemContainer}>
            <TouchableOpacity style={[styles.listItem, itemComplete && styles.listItemComplete, altColorTheme && styles.altListItem, itemComplete && altColorTheme && styles.altListItemComplete, modalVisible.active && modalVisible.id === item.id && styles.listItemModalSelected]} onPress={() => toggleItemComplete()}>

                <Text style={[styles.listItemText, itemComplete && { color: 'darkgray' }]}> <Text style={[styles.listItemIndicator, altColorTheme && styles.altListItemIndicator, itemComplete && { color: 'darkgray' }, modalVisible.active && modalVisible.id === item.id && { color: 'dimgray' }]}>•&nbsp;</Text> <Text style={[itemComplete && [styles.lineThrough, { color: 'darkgray' }], modalVisible.active && modalVisible.id === item.id && { color: 'lightgray' }]}>{item.text}</Text></Text>
                <TouchableOpacity onPress={() => setModalVisible({ active: true, id: item.id })}>
                    <View style={{ padding: 4, justifyContent: 'center', alignItems: 'center' }}><MaterialIcons name="delete" size={Constants.fontLgg} color={modalVisible.active && modalVisible.id === item.id ? 'dimgray' : Constants.colorRed} /></View>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    listItemContainer: {
        width: '100%',
    },
    listItem: {
        fontSize: 40,
        marginBottom: 8,
        color: Constants.colorWhite,
        backgroundColor: Constants.colorPrimary,
        borderColor: Constants.colorPrimaryDark,
        borderRadius: 4,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 2,
        width: '100%',
        minHeight: 62
    },
    listItemModalSelected: {
        backgroundColor: 'gray',
        borderColor: 'dimgray',
    },
    listItemComplete: {
        borderStyle: 'dotted',
        backgroundColor: Constants.colorPrimaryDark,
        borderColor: Constants.colorPrimary
    },
    listItemIndicator: {
        color: Constants.colorPrimaryDark,
        fontWeight: 'bold',
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontSm,
    },
    listItemText: {
        flex: 1,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        maxWidth: '90%',
        fontFamily: Constants.fontPrimary
    },
    listItemDelete: {
        fontWeight: 'bold',
        color: Constants.colorRed,
        fontSize: Constants.fontMd,
        padding: 8,
        transform: [{ scale: 1.4 }],
        fontFamily: Constants.fontPrimaryBold
    },
    lineThrough: {
        textDecorationLine: 'line-through',
    },
    /* for alt color theme */
    altListItem: {
        backgroundColor: Constants.colorSecondary,
        borderColor: Constants.colorSecondary
    },
    altListItemComplete: {
        backgroundColor: Constants.colorSecondaryDark,
        borderColor: Constants.colorSecondary
    },
    altListItemIndicator: {
        color: Constants.colorSecondaryDark,
    },
})