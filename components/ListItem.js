import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import Constants from '../constants/Styles'

export default function ListItem({ storeData, items, setItems, item, modalVisible, setModalVisible }) {
    const [itemComplete, setItemComplete] = useState(item.completed);


    useEffect(() => {
        item.completed = itemComplete
        setItems(items)
        storeData(items)
    }, [itemComplete])

    return (
        <View style={[styles.listItemContainer, modalVisible.active && modalVisible.id === item.id && styles.grayScale]}>
            <TouchableOpacity style={[styles.listItem, itemComplete && styles.listItemComplete]} onPress={() => setItemComplete(itemComplete => !itemComplete)}>

                <Text style={[styles.listItemText, itemComplete && styles.grayScale]}> <Text style={[styles.listItemIndicator, itemComplete && styles.grayScale]}>●&nbsp;</Text> <Text style={itemComplete && [styles.lineThrough, styles.grayScale]}>{item.text}</Text></Text>
                <TouchableOpacity onPress={() => setModalVisible({active: true, id: item.id})}>
                    <Text style={styles.listItemDelete}>X</Text>
                </TouchableOpacity>


            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    listItemContainer: {
        flex: 1
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
        borderWidth: 2
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
        wordBreak: 'break-word',
        fontFamily: Constants.fontPrimary
    }, 
    listItemDelete: {
        fontWeight: 'bold',
        color: Constants.colorRed,
        fontSize: Constants.fontMd,
        padding: 8,
        scale: 1.4,
        fontFamily: Constants.fontPrimaryBold
    },
    lineThrough: {
        textDecorationLine: 'line-through',
    },
    grayScale: {
        color: 'darkgray',
        filter: 'grayscale(1)'
    },  
})