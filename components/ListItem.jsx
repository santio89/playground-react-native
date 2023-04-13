import { useEffect, useState } from 'react'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux';
import Constants from '../constants/Styles'

export default function ListItem({ items, setItems, item, modalVisible, setModalVisible }) {
    const [itemComplete, setItemComplete] = useState(item.completed);
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)


    useEffect(() => {
        item.completed = itemComplete
        setItems(items)
    }, [itemComplete])

    return (
        <View style={[styles.listItemContainer, modalVisible.active && modalVisible.id === item.id && styles.grayScale]}>
            <TouchableOpacity style={[styles.listItem, itemComplete && styles.listItemComplete, altColorTheme && styles.altListItem, itemComplete && altColorTheme && styles.altListItemComplete]} onPress={() => setItemComplete(itemComplete => !itemComplete)}>

                <Text style={[styles.listItemText, itemComplete && styles.grayScale]}> <Text style={[styles.listItemIndicator, altColorTheme && styles.altListItemIndicator, itemComplete && styles.grayScale]}>●&nbsp;</Text> <Text style={itemComplete && [styles.lineThrough, styles.grayScale]}>{item.text}</Text></Text>
                <TouchableOpacity onPress={() => setModalVisible({ active: true, id: item.id })}>
                    <Text style={styles.listItemDelete}>X</Text>
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
        color: Constants.colorWhite,
        fontSize: 40,
        marginBottom: 10,
        backgroundColor: Constants.colorPrimary,
        borderRadius: 4,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Constants.colorPrimaryDark,
        borderStyle: 'solid',
        borderWidth: 2,
        width: '100%',
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
        transform: [{scale: 1.4}],
        fontFamily: Constants.fontPrimaryBold
    },
    lineThrough: {
        textDecorationLine: 'line-through',
    },
    grayScale: {
        color: 'darkgray',
        filter: 'grayscale(1)'
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