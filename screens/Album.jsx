import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAlbumItems, getAppsData } from '../store/actions/apps.action'
import Constants from '../constants/Styles'
import { LANGS } from '../constants/Langs'
import { LinearGradient } from 'expo-linear-gradient'
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import { storageSetItem, storageGetItem } from '../utils/AsyncStorage'
import Alert from '../utils/Alert'

const Album = ({ navigation }) => {
  const dispatch = useDispatch()

  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  const userId = useSelector(state => state.auth.userId)
  const darkMode = useSelector(state => state.settings.darkMode.enabled)
  const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
  const { selected: languageSelected } = useSelector(state => state.settings.language)

  const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

  const uriListData = useSelector(state => state.apps.albumList.items)

  const updateWindowWidth = () => {
    setWindowWidth(Dimensions.get('window').width)
  }

  /* dispatch para traer data actualizada */
  const dispatchGetAppsData = async () => {
    await dispatch(getAppsData(userId, storageGetItem));
  }

  const [uriList, setUriList] = useState(uriListData)
  const verifyPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()

    if (status !== 'granted') {
      Alert(`${text.cameraPermissionDenied}`)
      return false
    }
    return true
  }

  /*   const verifyPermissionsFile = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  
      if (status !== 'granted') {
        Alert(`${text.cameraPermissionDenied}`)
        return false
      }
      return true
    } */

  const handleTakeImage = async () => {
    const isCameraOk = await verifyPermissions();
    if (!isCameraOk) return;

    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    setUriList(uriList => ([...uriList, image.assets[0].uri]))
  }

  const handleUploadImage = async () => {
    /*     const iFileOk = await verifyPermissionsFile();
        if (!iFileOk) return; */

    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    setUriList(uriList => ([...uriList, image.assets[0].uri]))
  }


  useEffect(() => {
    dispatchGetAppsData()
    setUriList(uriListData)
  }, [])

  useEffect(() => {
    dispatch(setAlbumItems(userId, uriList, storageSetItem))
  }, [uriList])

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
      <ScrollView contentContainerStyle={[styles.albumContainer, !darkMode && styles.backgroundWhite]}>
        <View style={[styles.btnContainer, windowWidth < 800 && { fontSize: Constants.fontLg }]}>
          <TouchableOpacity style={[styles.albumBtn, altColorTheme && styles.altAlbumBtn, windowWidth < 480 && { minWidth: 140, maxWidth: 140, width: 140 }]} onPress={handleTakeImage}>
            <Text style={[styles.albumText]}><Entypo name="camera" size={Constants.fontXl} color={Constants.colorWhite} /></Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.albumBtn, altColorTheme && styles.altAlbumBtn, windowWidth < 480 && { minWidth: 140, maxWidth: 140, width: 140 }]} onPress={handleUploadImage}>
            <Text style={[styles.albumText]}><Entypo name="upload" size={Constants.fontXl} color={Constants.colorWhite} /></Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={[styles.albumImgContainer, altColorTheme && styles.altAlbumImgContainer]}>
          {uriList.map((item, i) => (
            <TouchableOpacity key={i} style={styles.albumImgBtn}>
              <Image style={styles.albumImg} source={{ uri: item }} />
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </View>
  )
}

export default Album

const styles = StyleSheet.create({
  menuWrapper: {
    width: '100%',
    backgroundColor: Constants.colorDark,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  albumContainer: {
    width: '100%',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: Constants.colorDark,
    maxWidth: 800,
    margin: 'auto'
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  albumBtn: {
    backgroundColor: Constants.colorPrimary,
    padding: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Constants.colorPrimaryDark,
    color: Constants.colorWhite,
    textAlign: 'center',
    margin: 10,
    minWidth: 180,
    maxWidth: 180,
    width: 180,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  albumText: {
    color: Constants.colorWhite,
    fontFamily: Constants.fontPrimaryBold,
    fontSize: Constants.fontXl
  },
  albumImgContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    borderRadius: 8,
    borderColor: Constants.colorPrimaryDark,
    borderWidth: 2,
    backgroundColor: Constants.colorPrimary,
    width: '100%',
    minWidth: 200,
    minHeight: 200,
    padding: 8,
  },
  albumImg: {
    borderRadius: 8,
    width: '100%',
    minWidth: 140,
    maxWidth: 140,
    aspectRatio: 1,
  },
  albumImgBtn: {
    margin: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
  altAlbumImgContainer: {
    borderColor: Constants.colorSecondaryDark,
    backgroundColor: Constants.colorSecondary,
  },
}
)