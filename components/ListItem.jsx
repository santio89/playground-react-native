import { useState, useEffect } from 'react'
import { Text, StyleSheet, TouchableOpacity, View, TextInput, Modal, SafeAreaView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../constants/Styles'
import { MaterialIcons } from '@expo/vector-icons';
import { setListItems } from '../store/actions/apps.action';
import { storageSetItem } from '../utils/AsyncStorage';

export default function ListItem({ userId, items, setItems, item, modalVisible, setModalVisible, text }) {
    const dispatch = useDispatch()

    const [itemComplete, setItemComplete] = useState(item.completed);
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const [input, setInput] = useState(item.text)
    const [editMode, setEditMode] = useState(false)

    const toggleItemComplete = () => {
        item.completed = !itemComplete

        setItemComplete(itemComplete => !itemComplete)
        setItems(items)
        dispatch(setListItems(userId, items, storageSetItem))
    }

    useEffect(() => {
        setInput(item.text)
    }, [editMode])

    return (
        <>
            <View style={styles.listItemContainer}>
                <TouchableOpacity style={[styles.listItem, itemComplete && styles.listItemComplete, altColorTheme && styles.altListItem, itemComplete && altColorTheme && styles.altListItemComplete, modalVisible.active && modalVisible.id === item.id && styles.listItemModalSelected]} onPress={toggleItemComplete}>

                    <Text style={[styles.listItemText, itemComplete && { color: 'darkgray' }]}>
                        <Text style={[styles.listItemIndicator, altColorTheme && styles.altListItemIndicator, itemComplete && { color: 'darkgray' }, modalVisible.active && modalVisible.id === item.id && { color: 'dimgray' }]}>
                            •&nbsp;
                        </Text>
                        <Text style={[itemComplete && [styles.lineThrough, { color: 'darkgray' }], modalVisible.active && modalVisible.id === item.id && { color: 'lightgray' }]}>{item.text}
                        </Text>
                    </Text>


                    <View style={{ padding: 4, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity disabled={itemComplete} onPress={() => { setEditMode(true) }}>
                            <View style={{ paddingBottom: 2, justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="mode-edit" size={Constants.fontLgg} color={(itemComplete || (modalVisible.active && modalVisible.id === item.id)) ? 'dimgray' : (altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark)} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => editMode ? dispatchEdit() : setModalVisible({ active: true, id: item.id })}>
                            <View style={{ paddingTop: 2, justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="delete" size={Constants.fontLgg} color={modalVisible.active && modalVisible.id === item.id ? 'dimgray' : Constants.colorRed} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </View>

            <Modal visible={editMode} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <Text style={styles.modalTitle}>{text.editTask}?</Text>
                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setEditMode(false) }}>
                                <Text style={[styles.modalBtnText]} >{text.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={input.trim() === ""} style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setEditMode(false) }}>
                                <Text style={[styles.modalBtnText]}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
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

    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
        minWidth: 300,
        maxWidth: 600,
        minHeight: 300,
    },
    modalInner: {
        backgroundColor: Constants.colorPrimary,
        borderColor: Constants.colorWhite,
        borderRadius: 4,
        borderWidth: 2,
        padding: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        minHeight: 300,
    },
    modalTitle: {
        fontSize: Constants.fontLg,
        fontWeight: 'bold',
        fontFamily: Constants.fontPrimaryBold,
        color: Constants.colorWhite,
        marginBottom: 20,
        width: '100%',
        textAlign: 'center'
    },
    modalBtnContainer: {
        flexDirection: 'row',
        maxWidth: '100%'
    },
    modalBtn: {
        padding: 8,
        paddingHorizontal: 2,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        backgroundColor: Constants.colorPrimaryDark,
        borderColor: Constants.colorWhite,
        marginHorizontal: 10,
        width: 120,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBtnText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        textAlign: 'center'
    },
    modalBorderDark: {
        borderColor: Constants.colorDark,
    },
    /* for alt color theme */
    altListItem: {
        backgroundColor: Constants.colorSecondary,
        borderColor: Constants.colorSecondaryDark
    },
    altListItemComplete: {
        backgroundColor: Constants.colorSecondaryDark,
        borderColor: Constants.colorSecondary
    },
    altListItemIndicator: {
        color: Constants.colorSecondaryDark,
    },
    altModalInner: {
        backgroundColor: Constants.colorSecondary,

    },
    altModalBtn: {
        backgroundColor: Constants.colorSecondaryDark,
    },
})