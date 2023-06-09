import { StyleSheet, Text, View, ScrollView, SafeAreaView, Dimensions, TouchableOpacity, Image, Modal, Platform, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAlbumItems } from '../store/actions/apps.action'
import Constants from '../constants/Styles'
import { LANGS } from '../constants/Langs'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker'
import { storageSetItem } from '../utils/AsyncStorage'
import Alert from '../utils/Alert'
import AlbumImg from '../components/AlbumImg'

const Album = ({ navigation }) => {
  const dispatch = useDispatch()

  const uriListData = useSelector(state => state.apps.albumList.items)
  const userId = useSelector(state => state.auth.userId)
  const darkMode = useSelector(state => state.settings.darkMode.enabled)
  const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
  const { selected: languageSelected } = useSelector(state => state.settings.language)

  const [uriList, setUriList] = useState(uriListData)

  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

  const [modalVisible, setModalVisible] = useState({ active: false, id: null })
  const [modalImg, setModalImg] = useState({ active: false, id: null, uri: null })

  const [bigImg, setBigImg] = useState(false)

  const appLoading = useSelector(state => state.apps.isLoading)
  const [loading, setLoading] = useState(false)

  const [itemDeleting, setItemDeleting] = useState(null)

  const [exchangeObj, setExchangeObj] = useState({ index1: null, index2: null })

  const [fullAlbum, setFullAlbum] = useState(false)

  const updateWindowWidth = () => {
    setWindowWidth(Dimensions.get('window').width)
  }

  const verifyPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== 'granted') {
      Alert(`${text.cameraPermissionDenied}`)
      return false
    }
    return true
  }

  const verifyPermissionsFile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert(`${text.cameraPermissionDenied}`)
      return false
    }
    return true
  }

  const handleTakeImage = async () => {
    const isCameraOk = await verifyPermissions();
    if (!isCameraOk) return;

    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    })

    if (image?.assets === null || undefined) {
      return
    }

    setLoading(true)
    const imgNew = { id: uuid.v4(), uri: Platform.OS !== 'web' ? `data:image/jpeg;base64,${image?.assets[0].base64}` : image?.assets[0].uri }
    dispatch(setAlbumItems(userId, [imgNew, ...uriList], storageSetItem))
  }

  const handleUploadImage = async () => {
    const iFileOk = await verifyPermissionsFile();
    if (!iFileOk) return;

    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    })


    if (image?.assets === null || image?.assets === undefined) {
      return
    }

    setLoading(true)
    const imgNew = { id: uuid.v4(), uri: Platform.OS !== 'web' ? `data:image/jpeg;base64,${image?.assets[0].base64}` : image?.assets[0].uri }
    dispatch(setAlbumItems(userId, [imgNew, ...uriList], storageSetItem))
  }

  const deleteItem = (id) => {
    setLoading(true)
    dispatch(setAlbumItems(userId, uriList.filter(item => item.id != id), storageSetItem))
  }

  const exchangeItem = (index1, index2) => {
    setLoading(true)
    const mItems = [...uriList]
    const mItem = uriList[index1]
    mItems[index1] = { ...mItems[index2] }
    mItems[index2] = { ...mItem }
    dispatch(setAlbumItems(userId, mItems, storageSetItem))
  }

  const handleExchange = (index) => {
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

  const returnNext = (id) => {
    const index = uriList.findIndex(item => item.id === id)

    if (uriList[index + 1]) {
      return uriList[index + 1]
    } else {
      return uriList[0]
    }
  }

  const returnPrev = (id) => {
    const index = uriList.findIndex(item => item.id === id)

    if (uriList[index - 1]) {
      return uriList[index - 1]
    } else {
      return uriList[uriList.length - 1]
    }
  }

  useEffect(() => {
    exchangeObj.index1 !== null && exchangeObj.index2 !== null && exchangeItem(exchangeObj.index1, exchangeObj.index2)
  }, [exchangeObj])


  useEffect(() => {
    setUriList(uriListData)
    setLoading(false)
    setItemDeleting(null)
    setExchangeObj({ index1: null, index2: null })

    uriListData.length < 24 ? setFullAlbum(false) : setFullAlbum(true)
  }, [uriListData])

  useEffect(() => {
    const dimensionsHandler = Dimensions.addEventListener("change", updateWindowWidth)

    return () => {
      dimensionsHandler.remove()
    }
  })

  useEffect(() => {
    setText(LANGS.find(lang => lang.lang === languageSelected).text)
  }, [languageSelected])

  useEffect(() => {
    navigation.setOptions({
      title: `${text.album} | PLAYGROUND`,
    })
  }, [text])


  return (
    <View style={[styles.albumWrapper, !darkMode && styles.backgroundWhite]}>
      <View style={[styles.btnContainer]}>
        <TouchableOpacity disabled={loading || appLoading || fullAlbum} style={[styles.albumBtn, altColorTheme && styles.altAlbumBtn, (loading || appLoading || fullAlbum) && { backgroundColor: 'gray', borderColor: 'dimgray' }]} onPress={handleTakeImage}>
          {fullAlbum ?
            <Text style={{ fontFamily: Constants.fontPrimary, fontSize: Constants.fontMd, color: Constants.colorWhite }}>{`${text.max}\n24 IMG`}</Text> :
            <Text style={[styles.albumText]}>{loading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <Entypo name="camera" size={Constants.fontLgg} color={Constants.colorWhite} />}</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity disabled={loading || appLoading || fullAlbum} style={[styles.albumBtn, altColorTheme && styles.altAlbumBtn, (loading || appLoading || fullAlbum) && { backgroundColor: 'gray', borderColor: 'dimgray' }]} onPress={handleUploadImage}>
          {fullAlbum ?
            <Text style={{ fontFamily: Constants.fontPrimary, fontSize: Constants.fontMd, color: Constants.colorWhite }}>{`${text.max}\n24 IMG`}</Text> :
            <Text style={[styles.albumText]}>{loading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <Entypo name="upload" size={Constants.fontLgg} color={Constants.colorWhite} />}</Text>
          }
        </TouchableOpacity>
      </View>
      <View style={[styles.albumContainer, !darkMode && styles.backgroundWhite]}>
        <ScrollView contentContainerStyle={[styles.albumImgContainer]}>
          {
            appLoading ? <ActivityIndicator size="large" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> :
              (!uriList || uriList.length === 0 ?
                <View style={{ width: '100%', maxWidth: windowWidth < 800 ? 320 : '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: Constants.colorWhite, fontFamily: Constants.fontPrimary, fontSize: Constants.fontLg, textAlign: 'center' }}>{text.noImg}
                  </Text>
                </View> :
                uriList.map((item, index) => (
                  item &&
                  <AlbumImg key={item.id} item={item} index={index} loading={loading} itemDeleting={itemDeleting} handleExchange={handleExchange} exchangeObj={exchangeObj} setItemDeleting={setItemDeleting} setModalVisible={setModalVisible} Platform={Platform} setModalImg={setModalImg} altColorTheme={altColorTheme} Constants={Constants} modalVisible={modalVisible} />
                )))
          }
        </ScrollView>
      </View>

      <Modal visible={modalVisible.active} transparent={true} animationType='fade'>
        <SafeAreaView style={styles.modal}>
          <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
            <Text style={styles.modalTitle}>{text.deletePic}?</Text>
            <View style={styles.modalBtnContainer}>
              <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setItemDeleting(null); setModalVisible({ active: false, id: null }) }}>
                <Text style={[styles.modalBtnText]} >{text.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn, styles.borderRed]} onPress={() => { deleteItem(modalVisible.id); setModalVisible({ active: false, id: null }) }}>
                <Text style={[styles.modalBtnText]}>{text.delete}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal visible={modalImg.active} transparent={true} animationType='fade'>
        <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: 'rgba(20,20,20,.8)', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>

          {
            modalImg.active &&
            (bigImg ?
              <SafeAreaView style={{ flex: 1, width: '100%', minWidth: '100%', maxWidth: '100%', height: '100%', minHeight: '100%', maxHeight: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                <Image style={[styles.albumModalImg, { aspectRatio: 'auto', width: '100%', height: '100%', borderRadius: 0 }]} source={{ uri: modalImg.uri }} />
                <View style={{ width: 'auto', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 0, right: 0 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, borderRadius: 0, borderWidth: 2, borderRightWidth: 1, borderColor: altColorTheme ? Constants.colorSecondary : Constants.colorPrimary, marginHorizontal: 0, marginLeft: 0 }}>
                    <TouchableOpacity style={{ padding: 4, width: 30, backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => { const prevImg = returnPrev(modalImg.id); setModalImg({ active: true, id: prevImg.id, uri: prevImg.uri }) }}>
                      <MaterialIcons style={{ width: 20, height: 20 }} name="navigate-before" size={Constants.fontMd} color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ padding: 4, width: 30, backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => { const nextImg = returnNext(modalImg.id); setModalImg({ active: true, id: nextImg.id, uri: nextImg.uri }) }}>
                      <MaterialIcons style={{ width: 20, height: 20 }} name="navigate-next" size={Constants.fontMd} color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginHorizontal: 0, marginRight: 0, borderStyle: 'solid', borderColor: altColorTheme ? Constants.colorSecondary : Constants.colorPrimary, borderWidth: 2, borderLeftWidth: 1, backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark }}>
                    <TouchableOpacity style={{ padding: 4, width: 30, backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => { setBigImg(false) }}>
                      <MaterialCommunityIcons style={{ width: 20, height: 20 }} name="arrow-collapse-all" size={Constants.fontMd} color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ padding: 4, width: 30, backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => { setBigImg(false); setModalImg({ active: false, id: null, uri: null }) }}>
                      <MaterialIcons style={{ width: 20, height: 20 }} name="close" size={Constants.fontMd} color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
              :
              <SafeAreaView style={{ flex: 1, width: '90%', minWidth: 280, maxWidth: 680, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={[styles.albumModalImg]} source={{ uri: modalImg.uri }} />
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, borderRadius: 4, borderWidth: 2, borderColor: altColorTheme ? Constants.colorSecondary : Constants.colorPrimary, marginHorizontal: 4 }}>
                    <TouchableOpacity style={{ padding: 4, width: 48, backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => { const prevImg = returnPrev(modalImg.id); setModalImg({ active: true, id: prevImg.id, uri: prevImg.uri }) }}>
                      <MaterialIcons style={{ width: 28, height: 28 }} name="navigate-before" size={Constants.fontLg} color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ padding: 4, width: 48, backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => { const nextImg = returnNext(modalImg.id); setModalImg({ active: true, id: nextImg.id, uri: nextImg.uri }) }}>
                      <MaterialIcons style={{ width: 28, height: 28 }} name="navigate-next" size={Constants.fontLg} color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'row', backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, borderRadius: 4, borderWidth: 2, borderColor: altColorTheme ? Constants.colorSecondary : Constants.colorPrimary, marginHorizontal: 4 }}>
                    <TouchableOpacity style={{ padding: 4, width: 48, backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => { setBigImg(true) }}>
                      <MaterialCommunityIcons style={{ width: 28, height: 28 }} name="arrow-expand-all" size={Constants.fontLg} color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ padding: 4, width: 48, backgroundColor: altColorTheme ? Constants.colorSecondaryDark : Constants.colorPrimaryDark, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => { setModalImg({ active: false, id: null, uri: null }); setBigImg(false) }}>
                      <MaterialIcons style={{ width: 28, height: 28 }} name="close" size={Constants.fontLg} color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>)
          }
        </ScrollView>
      </Modal>
    </View >
  )
}

export default Album

const styles = StyleSheet.create({
  albumWrapper: {
    width: '100%',
    maxWidth: '100%',
    backgroundColor: Constants.colorDark,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  albumContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    maxWidth: 1024,
    margin: 'auto'
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 300,
  },
  albumBtn: {
    backgroundColor: Constants.colorPrimary,
    padding: 2,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Constants.colorPrimaryDark,
    color: Constants.colorWhite,
    textAlign: 'center',
    margin: 10,
    minWidth: 140,
    maxWidth: 140,
    width: 140,
    height: 48,
    minHeight: 48,
    maxHeight: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  albumText: {
    color: Constants.colorWhite,
    fontFamily: Constants.fontPrimaryBold,
    fontSize: Constants.fontXl,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  albumImgContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%',
    minWidth: 240,
    marginVertical: 16
  },
  albumModalImg: {
    borderRadius: 8,
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
    marginVertical: 8
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
    backgroundColor: Constants.colorWhite
  },
  /* for alt color theme */
  altAlbumBtn: {
    backgroundColor: Constants.colorSecondary,
    borderColor: Constants.colorSecondaryDark,
  },
  altModalInner: {
    backgroundColor: Constants.colorSecondary,

  },
  altModalBtn: {
    backgroundColor: Constants.colorSecondaryDark,
  },
}
)