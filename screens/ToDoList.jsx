import { useEffect, useState } from 'react'
import { FlatList, Text, TextInput, View, SafeAreaView, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native'
import { useSelector } from 'react-redux';
import 'react-native-get-random-values'; /* for uuid */
import { v4 as uuidv4 } from 'uuid';
import ListItem from '../components/ListItem';
import { storageSetItem } from '../utils/AsyncStorage';
import Constants from '../constants/Styles';
import { LANGS } from '../constants/Langs';
import { setListItems } from '../store/actions/apps.action';
import { useDispatch } from 'react-redux/es/exports';

export default function ToDoList({navigation}) {
    const dispatch = useDispatch()
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [input, setInput] = useState("")
    const [modalVisible, setModalVisible] = useState({ active: false, id: null });


    const listItems = useSelector(state=>state.apps.toDoList.items)
    const [items, setItems] = useState(listItems)

    const userId = useSelector(state=>state.auth.userId)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const {selected: languageSelected} = useSelector(state=>state.settings.language)

    const [text, setText] = useState(LANGS.find(lang=>lang.lang === languageSelected).text)


    const addItem = (item) => {
        if (item.text === "") { return }
        
        setItems((oldItems) => [item, ...oldItems])
    }

    const deleteItem = (id) => {
        setItems((oldItems) => oldItems.filter(item => item.id != id))
    }
    

    useEffect(() => {
        input != '' ? setBtnDisabled(false) : setBtnDisabled(true)
    }, [input])

    useEffect(() => {
        dispatch(setListItems(userId, items, storageSetItem))
    }, [items])

    useEffect(()=>{
        setText(LANGS.find(lang=>lang.lang === languageSelected).text)
    }, [languageSelected])

    useEffect(()=>{
        navigation.setOptions({
            title: `${text.toDoList} | PLAYGROUND`,
        })
    }, [text])


    return (
        <>
            <View style={[styles.todoListContainer, !darkMode && styles.backgroundWhite]}>
                <View style={styles.listContainer}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
                        <TextInput value={input} onChangeText={input => setInput(input)} onSubmitEditing={() => { addItem({ id: uuidv4(), text: input }); setInput('') }} placeholder={text.newTask} placeholderTextColor="#808080" style={[styles.input, !darkMode && styles.colorDark, altColorTheme && styles.altInput]} />

                        <TouchableOpacity disabled={btnDisabled} onPress={() => { addItem({ id: uuidv4(), text: input, completed: false }); setInput('') }} style={[styles.buttonAddContainer, altColorTheme && styles.buttonAddContainer, altColorTheme && styles.altButtonAddContainer, btnDisabled && styles.buttonDisabled]}>
                            <Text style={styles.buttonAdd}>
                                {text.add}
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>

                    <FlatList contentContainerStyle={styles.listItemsContainer}
                        data={items}
                        renderItem={({ item }) => (
                            <>
                                <ListItem items={items} setItems={setItems} item={item} deleteItem={deleteItem} modalVisible={modalVisible} setModalVisible={setModalVisible} />

                                <Modal visible={modalVisible.active} transparent={true} animationType='fade'>
                                    <SafeAreaView style={styles.modal}>
                                        <View style={[styles.modalInner, !darkMode && styles.borderDark, altColorTheme && styles.altModalInner]}>
                                            <Text style={styles.modalTitle}>{text.deleteTask}?</Text>
                                            <View style={styles.modalBtnContainer}>
                                                <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible({ active: false, id: null })}>
                                                    <Text style={[styles.modalBtnText, altColorTheme && styles.altModalBtnText]} >{text.cancel}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.modalBtn} onPress={() => { deleteItem(modalVisible.id); setModalVisible({ active: false, id: null }) }}>
                                                    <Text style={[styles.modalBtnText, altColorTheme && styles.altModalBtnText, styles.borderRed]}>{text.delete}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </SafeAreaView>
                                </Modal>
                            </>
                        )}
                        keyExtractor={item => item.id}
                    />
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
        padding: 10
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
        marginTop: 10,
        marginBottom: 20,
        justifyContent: 'space-between',
        padding: 10,
    },
    input: {
        borderBottomColor: Constants.colorPrimary,
        borderBottomWidth: 2,
        color: Constants.colorWhite,
        flex: 1,
        marginRight: 10,
        fontSize: Constants.fontMd,
        padding: 4,
        minWidth: 10,
        fontFamily: Constants.fontPrimary,
    },
    buttonAddContainer: {
        backgroundColor: Constants.colorPrimary,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Constants.colorPrimaryDark,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        filter: 'grayscale(1)'
    },
    buttonAdd: {
        fontWeight: 'bold',
        fontFamily: Constants.fontPrimary,
        color: Constants.colorWhite,
        fontSize: Constants.fontMd,
    },
    listItemsContainer: {
        padding: 10,
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
        height: 300,
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
        height: 300,
    },
    modalTitle: {
        fontSize: Constants.fontLg,
        fontWeight: 'bold',
        fontFamily: Constants.fontPrimaryBold,
        color: Constants.colorWhite,
        marginBottom: 40,
        width: '100%',
        textAlign: 'center'
    },
    modalBtnContainer: {
        flexDirection: 'row',
        maxWidth: '100%'
    },
    modalBtnText: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontSm,
        padding: 8,
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        backgroundColor: Constants.colorPrimaryDark,
        borderColor: Constants.colorWhite,
        color: Constants.colorWhite,
        marginHorizontal: 10
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
    borderDark: {
        borderColor: Constants.colorDark,
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
    altModalBtnText: {
        backgroundColor: Constants.colorSecondaryDark,
    },
})