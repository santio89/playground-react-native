import { StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

const AlbumImg = ({ item, index, loading, itemDeleting, handleExchange, exchangeObj, setItemDeleting, setModalVisible, Platform, setModalImg, altColorTheme, Constants, modalVisible }) => {
    return (
        <View style={{ margin: 8, backgroundColor: (itemDeleting === item.id) ? 'darkgray' : (altColorTheme ? Constants.colorSecondary : Constants.colorPrimary), borderRadius: 8, overflow: 'hidden' }}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: (itemDeleting === item.id) ? 'gray' : (altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark), paddingHorizontal: 2, minHeight: 28, maxHeight: 28 }}>
                <TouchableOpacity disabled={loading} onPress={() => { handleExchange(index) }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="swap-vert" size={Constants.fontLg} color={((itemDeleting === item.id)) ? 'dimgray' : (exchangeObj.index1 === index || exchangeObj.index2 === index ? Constants.colorWhite : (altColorTheme ? Constants.colorSecondary : Constants.colorPrimary))} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity disabled={loading} onPress={() => { setItemDeleting(item.id); setModalVisible({ active: true, id: item.id }) }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="delete" size={Constants.fontLg} color={(itemDeleting === item.id) ? Constants.colorWhite : (altColorTheme ? Constants.colorSecondary : Constants.colorPrimary)} />
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity disabled={itemDeleting === item.id} style={[styles.albumImgBtn, Platform.OS === 'web' && modalVisible.active && modalVisible.id === item.id && { filter: 'grayscale(1)' }, Platform.OS === 'web' && itemDeleting === item.id && { filter: 'grayscale(1)' }]} onPress={() => { setModalImg({ active: true, id: item.id, uri: item.uri }) }}>
                <Image style={styles.albumImg} source={item.uri && item.uri !== "" ? { uri: item.uri } : require('../assets/icon.png')} />
            </TouchableOpacity>
        </View>
    )
}

export default AlbumImg

const styles = StyleSheet.create({
    albumImg: {
        width: '100%',
        minWidth: 160,
        maxWidth: 160,
        aspectRatio: 1,
        position: 'relative',
    },
    albumImgBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
})