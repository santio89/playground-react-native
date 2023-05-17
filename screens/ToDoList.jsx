import { useEffect, useState, useRef } from 'react'
import { FlatList, Text, TextInput, View, SafeAreaView, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Modal, Platform, ActivityIndicator } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import uuid from 'react-native-uuid';
import ListItem from '../components/ListItem';
import { storageSetItem } from '../utils/AsyncStorage';
import Constants from '../constants/Styles';
import { LANGS } from '../constants/Langs';
import { setListItems } from '../store/actions/apps.action';

export default function ToDoList({ navigation }) {
    const dispatch = useDispatch()

    const listItems = useSelector(state => state.apps.toDoList.items)
    const [items, setItems] = useState(listItems)

    const userId = useSelector(state => state.auth.userId)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const { selected: languageSelected } = useSelector(state => state.settings.language)

    const [btnDisabled, setBtnDisabled] = useState(true)
    const [input, setInput] = useState("")
    const [modalVisible, setModalVisible] = useState({ active: false, id: null });

    const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

    const appLoading = useSelector(state => state.apps.isLoading)
    const [loading, setLoading] = useState(false)

    const [exchangeObj, setExchangeObj] = useState({ index1: null, index2: null })


    const addItem = (item) => {
        item.text = item.text.trim()
        if (item.text === "") { return }

        dispatch(setListItems(userId, [item, ...items], storageSetItem, setLoading))
    }

    const deleteItem = (id) => {
        dispatch(setListItems(userId, items.filter(item => item.id != id), storageSetItem, setLoading))
    }

    const editItem = (item, editInput) => {
        item.text = editInput.trim()
        
        dispatch(setListItems(userId, items, storageSetItem, setLoading))
    }

    const exchangeItem = (index1, index2) => {
        const mItems = [...items]
        const mItem = items[index1]
        mItems[index1] = { ...mItems[index2] }
        mItems[index2] = { ...mItem }

        dispatch(setListItems(userId, mItems, storageSetItem, setLoading))
    }


    useEffect(() => {
        exchangeObj.index1 !== null && exchangeObj.index2 !== null && exchangeItem(exchangeObj.index1, exchangeObj.index2)
    }, [exchangeObj])

    useEffect(() => {
        setItems(listItems)
        setExchangeObj({ index1: null, index2: null })
        setLoading(false)
    }, [listItems])

    useEffect(() => {
        input.trim() != '' ? setBtnDisabled(false) : setBtnDisabled(true)
    }, [input])

    useEffect(() => {
        setText(LANGS.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.toDoList} | PLAYGROUND`,
        })
    }, [text])


    return (
        <>
            <View style={[styles.todoListContainer, !darkMode && styles.backgroundWhite]}>
                <View style={styles.listContainer}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
                        <TextInput disabled={loading || appLoading} value={input} onChangeText={input => setInput(input)} onSubmitEditing={() => { addItem({ id: uuid.v4(), text: input, completed: false, important: false }); setInput('') }} placeholder={text.newTask} placeholderTextColor="#808080" style={[styles.input, !darkMode && styles.colorDark, altColorTheme && styles.altInput, (loading || appLoading) && { borderBottomColor: 'dimgray' }]} />
                        <TouchableOpacity disabled={btnDisabled} onPress={() => { addItem({ id: uuid.v4(), text: input, completed: false, important:false }); setInput('') }} style={[styles.buttonAddContainer, altColorTheme && styles.buttonAddContainer, altColorTheme && styles.altButtonAddContainer, btnDisabled && styles.buttonDisabled]}>
                            <Text style={[styles.buttonAdd, , btnDisabled && { color: 'lightgray' }]}>
                                {loading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : text.add}
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                    {appLoading ? <ActivityIndicator size="large" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <FlatList contentContainerStyle={styles.listItemsContainer}
                        data={items}
                        renderItem={({ item, index }) => (
                            <ListItem index={index} userId={userId} items={items} setItems={setItems} item={item} deleteItem={deleteItem} modalVisible={modalVisible} setModalVisible={setModalVisible} text={text} editItem={editItem} loading={loading} exchangeObj={exchangeObj} setExchangeObj={setExchangeObj} />
                        )}
                        keyExtractor={item => item.id}
                    />}

                    <Modal visible={modalVisible.active} transparent={true} animationType='fade'>
                        <SafeAreaView style={styles.modal}>
                            <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
                                <Text style={styles.modalTitle}>{text.deleteTask}</Text>
                                <View style={styles.modalBtnContainer}>
                                    <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => setModalVisible({ active: false, id: null })}>
                                        <Text style={[styles.modalBtnText]} >{text.cancel}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn, styles.borderRed]} onPress={() => { deleteItem(modalVisible.id); setModalVisible({ active: false, id: null }) }}>
                                        <Text style={[styles.modalBtnText]}>{text.delete}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </SafeAreaView>
                    </Modal>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    todoListContainer: {
        flex: 1,
        backgroundColor: Constants.colorDark,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    listContainer: {
        flex: 1,
        width: '100%',
        minWidth: 300,
        maxWidth: 800,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 8,
        justifyContent: 'space-between',
        padding: 8,
    },
    input: {
        borderBottomColor: Constants.colorPrimary,
        borderBottomWidth: 2,
        color: Constants.colorWhite,
        flex: 1,
        marginRight: 8,
        fontSize: Constants.fontMd,
        padding: 4,
        minWidth: 8,
        fontFamily: Constants.fontPrimary,
    },
    buttonAddContainer: {
        backgroundColor: Constants.colorPrimary,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Constants.colorPrimaryDark,
        padding: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 114
    },
    buttonDisabled: {
        backgroundColor: 'gray',
        borderColor: 'dimgray',
    },
    buttonAdd: {
        fontWeight: 'bold',
        fontFamily: Constants.fontPrimary,
        color: Constants.colorWhite,
        fontSize: Constants.fontMd,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 24,
        height: 24,
        maxHeight: 24
    },
    listItemsContainer: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginVertical: 8,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'stretch',
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
    borderRed: {
        borderColor: Constants.colorRed,
    },
    /* for dark mode off */
    backgroundWhite: {
        backgroundColor: Constants.colorWhite,
    },
    colorDark: {
        color: Constants.colorDark,
    },
    /* for alt color theme */
    altInput: {
        borderBottomColor: Constants.colorSecondary,
    },
    altButtonAddContainer: {
        backgroundColor: Constants.colorSecondary,
        borderColor: Constants.colorSecondaryDark,
    },
    altModalInner: {
        backgroundColor: Constants.colorSecondary,

    },
    altModalBtn: {
        backgroundColor: Constants.colorSecondaryDark,
    },
})