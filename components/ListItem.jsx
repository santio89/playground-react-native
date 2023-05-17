import { useState } from 'react'
import { Text, StyleSheet, TouchableOpacity, View, TextInput, Modal, SafeAreaView, ActivityIndicator } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import Constants from '../constants/Styles'
import { MaterialIcons } from '@expo/vector-icons';
import { setListItems } from '../store/actions/apps.action';
import { storageSetItem } from '../utils/AsyncStorage';

export default function ListItem({ index, userId, items, setItems, item, modalVisible, setModalVisible, text, editItem, loading, exchangeObj, setExchangeObj }) {
    const dispatch = useDispatch()

    const [itemComplete, setItemComplete] = useState(item.completed);
    const [important, setImportant] = useState(item.important)
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

    const toggleImportant = () => {
        item.important = !important

        setImportant(important => !important)
        setItems(items)
        dispatch(setListItems(userId, items, storageSetItem))
    }

    const handleExchange = () => {
        if (exchangeObj.index1 === index) {
            setExchangeObj({ ...exchangeObj, index1: null })
        }
        if (exchangeObj.index2 === index) {
            setExchangeObj({ ...exchangeObj, index2: null })
        }
        if (exchangeObj.index1 !== index && exchangeObj.index2 !== index) {
            if (exchangeObj.index1 === null) {
                setExchangeObj({ ...exchangeObj, index1: index })
            } else if (exchangeObj.index2 === null) {
                setExchangeObj({ ...exchangeObj, index2: index })
            }
        }
    }


    return (
        <>
            <View style={styles.listItemContainer}>
                <TouchableOpacity disabled={loading} style={[styles.listItem, itemComplete && styles.listItemComplete, altColorTheme && styles.altListItem, itemComplete && altColorTheme && styles.altListItemComplete, modalVisible.active && modalVisible.id === item.id && styles.listItemModalSelected, editMode && { borderStyle: 'dotted', borderColor: Constants.colorWhite }, (exchangeObj.index1 === index || exchangeObj.index2 === index) && { borderStyle: 'dotted', borderColor: Constants.colorWhite }]} onPress={toggleItemComplete}>
                    <View style={styles.itemBtnContainer}>
                        <TouchableOpacity disabled={loading} onPress={() => { handleExchange() }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="swap-vert" size={Constants.fontLg} color={((modalVisible.active && modalVisible.id === item.id)) ? 'dimgray' : (exchangeObj.index1 === index || exchangeObj.index2 === index ? Constants.colorWhite : (itemComplete ? (altColorTheme ? Constants.colorSecondary : Constants.colorPrimary) : (altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark)))} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={loading} onPress={() => { setEditMode(true) }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="mode-edit" size={Constants.fontLg} color={((modalVisible.active && modalVisible.id === item.id)) ? 'dimgray' : (editMode ? Constants.colorWhite : (itemComplete ? (altColorTheme ? Constants.colorSecondary : Constants.colorPrimary) : (altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark)))} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={loading} onPress={() => setModalVisible({ active: true, id: item.id })}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="delete" size={Constants.fontLg} color={modalVisible.active && modalVisible.id === item.id ? Constants.colorWhite : (itemComplete ? (altColorTheme ? Constants.colorSecondary : Constants.colorPrimary) : (altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark))} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={loading} onPress={() => { toggleImportant() }}>
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <MaterialIcons name="label-important" size={Constants.fontLg} color={((modalVisible.active && modalVisible.id === item.id)) ? 'dimgray' : (item.important ? Constants.colorWhite : (itemComplete ? (altColorTheme ? Constants.colorSecondary : Constants.colorPrimary) : (altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark)))} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.listItemText, itemComplete && { color: 'darkgray' }]}>
                        <Text style={[styles.listItemIndicator, altColorTheme && styles.altListItemIndicator, itemComplete && { color: 'darkgray' }, modalVisible.active && modalVisible.id === item.id && { color: 'dimgray' }]}>
                            •&nbsp;
                        </Text>
                        <Text style={[itemComplete && [styles.lineThrough, { color: 'darkgray' }], modalVisible.active && modalVisible.id === item.id && { color: 'lightgray' }]}>{item.text}
                        </Text>
                    </Text>

                </TouchableOpacity>
            </View>

            <Modal visible={editMode} transparent={true} animationType='fade'>
                <SafeAreaView style={styles.modal}>
                    <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                        <View style={styles.modalTitle}>
                            <Text style={styles.modalTitleText}>{text.editTask}</Text>
                            <TextInput value={input} style={styles.modalText} placeholder={text.enterTask} placeholderTextColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} onChangeText={input => setInput(input)} onSubmitEditing={() => { editItem(item, input), setEditMode(false), setInput(input => input.trim()) }} />
                        </View>
                        <View style={styles.modalBtnContainer}>
                            <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setInput(item.text); setEditMode(false) }}>
                                <Text style={[styles.modalBtnText]} >{text.cancel}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={loading || input.trim() === "" || input.trim() === item.text} style={[styles.modalBtn, altColorTheme && styles.altModalBtn, (loading || input.trim() === "" || input.trim() === item.text) && { borderColor: 'darkgray' }]} onPress={() => { editItem(item, input), setEditMode(false), setInput(input => input.trim()) }}>
                                <Text style={[styles.modalBtnText, (loading || input.trim() === "" || input.trim() === item.text) && { color: 'darkgray' }]}>{loading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : "OK"}</Text>
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
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderStyle: 'solid',
        borderWidth: 2,
        width: '100%',
        minHeight: 92
    },
    listItemModalSelected: {
        backgroundColor: 'gray',
        borderColor: Constants.colorWhite,
        borderStyle: 'dotted'
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
        maxWidth: '100%',
        fontFamily: Constants.fontPrimary,
        padding: 8,
        paddingTop: 4,
        paddingBottom: 4,
        marginBottom: 28,
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
    itemBtnContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        height: 28,
        minHeight: 28,
        maxHeight: 28,
        width: '100%'
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
        marginBottom: 20,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    modalTitleText: {
        fontSize: Constants.fontLg,
        fontWeight: 'bold',
        fontFamily: Constants.fontPrimaryBold,
        color: Constants.colorWhite,
    },
    modalText: {
        fontFamily: Constants.fontPrimary,
        backgroundColor: Constants.colorPrimaryDark,
        padding: 8,
        borderRadius: 4,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20,
        alignItems: 'center',
        textAlign: 'center',
        color: Constants.colorWhite,
        fontSize: Constants.fontLg,
        fontFamily: Constants.fontPrimary,
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