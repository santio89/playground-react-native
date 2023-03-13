import React, { useEffect, useState } from 'react'
import { FlatList, Text, TextInput, View, KeyboardAvoidingView, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native'
import 'react-native-get-random-values'; /* for uuid */
import { v4 as uuidv4 } from 'uuid';
import ListItem from '../components/ListItem';
import { storageSetItem, storageGetItem } from '../components/AsyncStorage';
import Constants from '../constants/Styles';

export default function ToDoList() {
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [input, setInput] = useState("")
    const [items, setItems] = useState([])
    const [modalVisible, setModalVisible] = useState({ active: false, id: null });

    const storeData = async (items) => {
        try {
            await storageSetItem("pg-tdl-list", JSON.stringify(items));
        } catch (error) {
            console.log("error saving data to storage")
        }
    };

    const retrieveData = async () => {
        try {
            const value = await storageGetItem('pg-tdl-list');
            if (value !== null) {
                setItems(JSON.parse(value))
            }
        } catch (error) {
            console.log("error retrieving data from storage")
        }
    };


    const addItem = (item) => {
        if (item.text === "") { return }
        setItems((oldItems) => [item, ...oldItems])
    }

    const deleteItem = (id) => {
        setItems((oldItems) => oldItems.filter(item => item.id != id))
    }

    useEffect(() => {
        retrieveData();
    }, [])

    useEffect(() => {
        input != '' ? setBtnDisabled(false) : setBtnDisabled(true)
    }, [input])

    useEffect(() => {
        storeData(items)
    }, [items])


    return (
        <> 
            <View style={styles.todoListContainer}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
                    <TextInput value={input} onChangeText={input => setInput(input)} onSubmitEditing={() => { addItem({ id: uuidv4(), text: input }); setInput('') }} placeholder='NUEVA TAREA' placeholderTextColor="#808080" style={styles.input} />

                    <TouchableOpacity disabled={btnDisabled} onPress={() => { addItem({ id: uuidv4(), text: input, completed: false }); setInput('') }} style={[styles.buttonAddContainer, btnDisabled && styles.buttonDisabled]}>
                        <Text style={styles.buttonAdd}>
                            AGREGAR
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>

                <FlatList contentContainerStyle={styles.listItemContainer}
                    data={items}
                    renderItem={({ item }) => (
                        <>
                            <ListItem storeData={storeData} items={items} setItems={setItems} item={item} deleteItem={deleteItem} modalVisible={modalVisible} setModalVisible={setModalVisible} />

                            <Modal visible={modalVisible.active} transparent={true} animationType='fade'>
                                <View style={styles.modal}>
                                    <View style={styles.modalInner}>
                                        <Text style={styles.modalTitle}>ELIMINAR TAREA?</Text>
                                        <View style={styles.modalBtnContainer}>
                                            <TouchableOpacity style={styles.modalBtn}>
                                                <Text style={styles.modalBtnText} onPress={() => setModalVisible({ active: false, id: null })}>Cancelar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.modalBtn} onPress={() => { deleteItem(modalVisible.id); setModalVisible({ active: false, id: null }) }}>
                                                <Text style={[styles.modalBtnText, styles.borderRed]}>Eliminar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                        </>
                    )}
                    keyExtractor={item => item.id}
                />
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
        color: Constants.colorWhite,
        width: '100%',
    },

    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 20,
        maxWidth: 800,
        justifyContent: 'space-between',
        padding: 10,
    },
    input: {
        borderBottomColor: Constants.colorPrimary,
        borderBottomWidth: 2,
        color: 'white',
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
    listItemContainer: {
        width: '100%',
        padding: 10,
        maxWidth: 800,
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
        marginBottom: 40
    },
    modalBtnContainer: {
        flexDirection: 'row',
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
    }
})