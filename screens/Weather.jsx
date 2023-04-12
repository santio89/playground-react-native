import { StyleSheet, Text, View, SafeAreaView, ScrollView, ActivityIndicator, RefreshControl, Image, Dimensions, TouchableOpacity, Modal } from 'react-native'
import * as Location from 'expo-location'
/* import MapView from 'react-native-maps' */
import { Entypo } from '@expo/vector-icons'
import { useState, useEffect } from 'react'
import Constants from '../constants/Styles.js'
import { LANGS } from '../constants/Langs.js'
import { WEATHER_API_KEY } from '../constants/Database.js'
import { MAPS_API_KEY } from '../constants/Database.js'
import Alert from '../utils/Alert'
import { useSelector } from 'react-redux'
import { TextInput } from 'react-native-web'

const Weather = ({ navigation }) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${WEATHER_API_KEY}`

  const [forecast, setForecast] = useState(null)
  const [spForecast, setSpForecast] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const darkMode = useSelector(state => state.settings.darkMode.enabled)
  const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
  const { selected: languageSelected } = useSelector(state => state.settings.language)
  const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

  const [modalVisible, setModalVisible] = useState(false)
  const [searchError, setSearchError] = useState(null)

  const [location, setLocation] = useState(null)
  const [inputLocation, setInputLocation] = useState("")

  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const updateWindowWidth = () => {
    setWindowWidth(Dimensions.get('window').width)
  }

  const loadLocation = async () => {
    setRefreshing(true);
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert(`${text.locationPermissionDenied}`)
    } else {

      try {
        const loc = await Location.getCurrentPositionAsync({
          enableHighAccuracy: true,
          timeout: 5000
        })

        setLocation(loc)

      } catch (e) {
        console.log("error getting geo position: ", e)
      }

      setRefreshing(false)
    }
  }

  const fetchWeatherData = async (input) => {
    try {
      const response = await fetch(`${url}${input ? `&q=${input}` : `&lat=${location.coords.latitude}&lon=${location.coords.longitude}`}`)
      const data = await response.json()

      if (!response.ok) {
        input ? setSearchError(text.searchError) : console.log("error fetching weather report ")
      } else {
        setForecast(data)
        setModalVisible(false)
        setInputLocation("")
        setSearchError(null)
      }
    } catch (e) {
      console.log("error fetching weather data: ", e)
    }

    /* para otro idioma */
    try {
      const response = await fetch(`${url}${input ? `&q=${input}` : `&lat=${location.coords.latitude}&lon=${location.coords.longitude}`}&lang=sp`)
      const data = await response.json()

      if (!response.ok) {
        input ? setSearchError(text.searchError) : console.log("error fetching weather report ")
      } else {
        setSpForecast(data)
        setModalVisible(false)
        setInputLocation("")
        setSearchError(null)
      }
    } catch (e) {
      console.log("error fetching weather data: ", e)
    }


  }


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
      title: `${text.weather} | PLAYGROUND`,
    })
  }, [text])

  useEffect(() => {
    location !== null && fetchWeatherData()
  }, [location])


  useEffect(() => {
    loadLocation()
  }, [])


  return (
    <>
      <ScrollView contentContainerStyle={[styles.weatherAppWrapper, !darkMode && styles.altWeatherAppWrapper]}>
        <View style={styles.weatherAppContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadLocation()} />} >


          <View style={styles.weatherData}>
            {
              !forecast ?
                <ActivityIndicator size="large" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                :
                <>
                  <View style={styles.weatherHeader}>
                    <Text style={[styles.weatherTitle, altColorTheme && styles.altWeatherTitle]}>{forecast.name.toLocaleUpperCase()}</Text>
                    <TouchableOpacity style={[styles.weatherPinLocation, altColorTheme && styles.altWeatherPinLocation]} onPress={() => { setModalVisible(true) }} ><Entypo name="location-pin" size={Constants.fontXl} color={Constants.colorWhite} /></TouchableOpacity>
                  </View>

                  <View style={[styles.weatherTitleContainer, altColorTheme && styles.altWeatherTitleContainer]}>
                    <Text style={styles.weatherTitleLocation}>{text.weather}</Text>
                    <View style={styles.weatherTitleContent}>
                      <View style={styles.weatherTitleImgWrapper}>
                        <Image style={styles.weatherTitleImg} source={{ uri: `http://openweathermap.org/img/wn/${forecast?.weather[0].icon}@4x.png` }} />
                        <Text style={styles.weatherTitleTemp}>{`${Math.trunc(Number(forecast.main.temp))} °C\n${Math.trunc((Number(forecast.main.temp) * (9 / 5)) + 32)} °F`}</Text>
                      </View>
                      <Text style={styles.weatherTitleInfo}>
                        {languageSelected === "spanish" ? spForecast?.weather[0].description.toLocaleUpperCase() : forecast?.weather[0].description.toLocaleUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.rowItems, windowWidth > 800 && { flexDirection: 'row' }]}>
                    <View style={[styles.weatherTitleContainer, { height: 200, minHeight: 200, maxHeight: 200 }, windowWidth > 800 && { marginRight: 10, flex: 1 }, altColorTheme && styles.altWeatherTitleContainer]}>
                      <Text style={styles.weatherTitleLocation}>{text.feels}</Text>
                      <View style={styles.weatherTitleContent}>
                        <View style={styles.weatherTitleImgWrapper}>
                          <Image style={[styles.weatherTitleImg, { maxWidth: 100 }]} source={require('../assets/img/feels.png')} />
                          <Text style={[styles.weatherTitleTemp, { padding: 20 }]}>{`${Math.trunc(Number(forecast.main.feels_like))} °C\n${Math.trunc((Number(forecast.main.feels_like) * (9 / 5)) + 32)} °F`}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.weatherTitleContainer, { height: 200, minHeight: 200, maxHeight: 200 }, windowWidth > 800 && { marginLeft: 10, flex: 1 }, altColorTheme && styles.altWeatherTitleContainer]}>
                      <Text style={[styles.weatherTitleLocation]}>{text.humidity}</Text>
                      <View style={styles.weatherTitleContent}>
                        <View style={styles.weatherTitleImgWrapper}>
                          <Image style={[styles.weatherTitleImg, { maxWidth: 100 }]} source={require('../assets/img/humidity.png')} />
                          <Text style={[styles.weatherTitleTemp, { padding: 20 }]}>{`${forecast.main.humidity}%`}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
            }
          </View>
        </View>
      </ScrollView >
      <Modal visible={modalVisible} transparent={true} animationType='fade'>
        <SafeAreaView style={styles.modal}>
          <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
            <Text style={[styles.modalTitle]}>
              <Text style={searchError && { color: Constants.colorRed }}>{searchError ? searchError : text.inputLocation}</Text>
              <View style={[styles.modalText, altColorTheme && styles.altModalText]}>
                <TextInput style={[styles.inputLocation, altColorTheme && styles.altInputLocation]} autoCapitalize='none' placeholder={forecast?.name.toLocaleUpperCase()}
                  placeholderTextColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} value={inputLocation} onChangeText={location => setInputLocation(location.toLocaleUpperCase())} onSubmitEditing={() => { location !== "" && fetchWeatherData(inputLocation) }} />

                {/*    <MapView initialRegion={{latitude: 0, longitude: 0, latitudeDelta: 0, longitudeDelta: 0}}/> */}

              </View>
            </Text>
            <View style={styles.modalBtnContainer}>
              <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setModalVisible(false); setInputLocation(""); setSearchError(null) }}>
                <Text style={[styles.modalBtnText]}>{text.close}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { location !== "" && fetchWeatherData(inputLocation) }}>
                <Text style={[styles.modalBtnText]}>{text.search}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  )
}

export default Weather

const styles = StyleSheet.create({
  weatherAppWrapper: {
    flex: 1,
    backgroundColor: Constants.colorDark,
    justifyContent: 'start',
    alignItems: 'center',
    padding: 10,
    width: '100%'
  },
  weatherAppContainer: {
    width: '100%',
    minWidth: 300,
    maxWidth: 800,
    flex: 1,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherPinLocation: {
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Constants.colorPrimaryDark,
    backgroundColor: Constants.colorPrimary
  },
  weatherData: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  weatherTitleContainer: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Constants.colorPrimaryDark,
    backgroundColor: Constants.colorPrimary,
    padding: 10,
    height: 300,
    minHeight: 300,
    maxHeight: 300,
    marginBottom: 20,
  },
  weatherTitle:
  {
    fontFamily: Constants.fontPrimaryBold,
    color: Constants.colorPrimary,
    fontSize: Constants.fontXl,
    textAlign: 'center'
  },
  weatherTitleLocation:
  {
    fontFamily: Constants.fontPrimaryBold,
    color: Constants.colorWhite,
    fontSize: Constants.fontLg,
    alignSelf: 'flex-start'
  },
  weatherTitleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  weatherTitleImgWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  weatherTitleImg: {
    width: '50%',
    maxWidth: 200,
    aspectRatio: 1,
  },
  weatherTitleTemp: {
    color: Constants.colorWhite,
    fontSize: Constants.fontLg,
    fontFamily: Constants.fontPrimary,
  },
  weatherTitleInfo: {
    color: Constants.colorWhite,
    fontSize: Constants.fontLg,
    textAlign: 'center'
  },
  rowItems: {
    flexDirection: 'column',
    justifyContent: 'space-evenly'
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  modalText: {
    fontFamily: Constants.fontPrimary,
    backgroundColor: Constants.colorPrimaryDark,
    padding: 8,
    borderRadius: 4,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20,
    wordBreak: 'break-word',
    textAlign: 'center'
  },
  modalBtnContainer: {
    flexDirection: 'row',
    maxWidth: '100%'
  },
  modalBtn: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    backgroundColor: Constants.colorPrimaryDark,
    borderColor: Constants.colorWhite,
    marginHorizontal: 10,
    width: 100,
    textAlign: 'center'
  },
  modalBtnText: {
    fontFamily: Constants.fontPrimary,
    fontSize: Constants.fontMd,
    color: Constants.colorWhite,
  },
  modalBorderDark: {
    borderColor: Constants.colorDark,
  },
  inputLocation: {
    width: '100%',
    fontSize: Constants.fontLg,
    color: Constants.colorWhite,
    paddingHorizontal: 4,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    outlineStyle: 'none',
    borderBottomWidth: 2,
    borderBottomColor: Constants.colorPrimary,
  },
  /* for dark mode off */
  altWeatherAppWrapper: {
    backgroundColor: Constants.colorWhite,
  },
  /* for alt color mode */
  altWeatherTitleContainer: {
    borderColor: Constants.colorSecondaryDark,
    backgroundColor: Constants.colorSecondary,
  },
  altWeatherTitle: {
    color: Constants.colorSecondary,
  },

  altModalInner: {
    backgroundColor: Constants.colorSecondary,

  },
  altModalBtn: {
    backgroundColor: Constants.colorSecondaryDark,
  },
  altModalText: {
    backgroundColor: Constants.colorSecondaryDark,
  },
  altModalText: {
    backgroundColor: Constants.colorSecondaryDark,
  },
  altWeatherPinLocation: {
    borderColor: Constants.colorSecondaryDark,
    backgroundColor: Constants.colorSecondary
  },
  altInputLocation: {
    borderBottomColor: Constants.colorSecondary,
  },
})