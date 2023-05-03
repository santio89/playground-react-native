import { StyleSheet, Text, TextInput, View, SafeAreaView, KeyboardAvoidingView, ScrollView, FlatList, ActivityIndicator, RefreshControl, Image, Dimensions, TouchableOpacity, Modal } from 'react-native'
import * as Location from 'expo-location'
import { Entypo } from '@expo/vector-icons'
import { Foundation } from '@expo/vector-icons';
import { useState, useEffect } from 'react'
import Constants from '../constants/Styles.js'
import { LANGS } from '../constants/Langs.js'
import { WEATHER_API_KEY } from '../constants/Database.js'
import Alert from '../utils/Alert'
import { useSelector } from 'react-redux'

const Weather = ({ navigation }) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${WEATHER_API_KEY}`

  const urlExtended = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${WEATHER_API_KEY}`

  const [forecast, setForecast] = useState(null)
  const [spForecast, setSpForecast] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [reloading, setReloading] = useState(false)

  const [extendedForecast, setExtendedForecast] = useState(null)
  const [spExtendedForecast, setSpExtendedForecast] = useState(null)
  const [fetchingExtendedForecast, setFetchingExtendedForecast] = useState(false)

  const darkMode = useSelector(state => state.settings.darkMode.enabled)
  const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
  const { selected: languageSelected } = useSelector(state => state.settings.language)
  const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

  const [modalVisible, setModalVisible] = useState(false)
  const [searchError, setSearchError] = useState(null)

  const [calendarModal, setCalendarModal] = useState(false)

  const [location, setLocation] = useState(null)
  const [inputLocation, setInputLocation] = useState("")

  const [validInput, setValidInput] = useState(false)

  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const updateWindowWidth = () => {
    setWindowWidth(Dimensions.get('window').width)
  }
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const updateWindowHeight = () => {
    setWindowHeight(Dimensions.get('window').height)
  }

  const loadLocation = async () => {
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
    }
  }

  const fetchWeatherData = async (input) => {
    input = input?.trim();
    if (input === "") {
      return
    }

    setRefreshing(true);

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
        setLocation({ coords: { latitude: data.coord.lat, longitude: data.coord.lat } })
      }
    } catch (e) {
      console.log("error fetching weather data: ", e)
    }

    /* fetch para otro idioma */
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

    setRefreshing(false)
    reloading && setReloading(false)
  }

  const fetchExtendedForecast = async () => {
    setFetchingExtendedForecast(true);

    try {
      const response = await fetch(`${urlExtended}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`)
      const data = await response.json()

      if (!response.ok) {
        console.log("error fetching extended weather report ")
      } else {
        setExtendedForecast(data)
      }
    } catch (e) {
      console.log("error fetching weather data: ", e)
    }

    /* fetch para otro idioma */
    try {
      const response = await fetch(`${urlExtended}&lat=${location.coords.latitude}&lon=${location.coords.longitude}&lang=sp`)
      const data = await response.json()

      if (!response.ok) {
        console.log("error fetching extended weather report ")
      } else {
        setSpExtendedForecast(data)
      }
    } catch (e) {
      console.log("error fetching weather data: ", e)
    }

    setFetchingExtendedForecast(false)
  }

  const reloadWeather = async () => {
    setReloading(true);
    await loadLocation()
  }


  useEffect(() => {
    const dimensionsHandler = Dimensions.addEventListener("change", updateWindowWidth)
    const dimensionsHandlerH = Dimensions.addEventListener("change", updateWindowHeight)

    return () => {
      dimensionsHandler.remove()
      dimensionsHandlerH.remove()
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
    location !== null && location.timestamp && fetchWeatherData()
  }, [location])

  useEffect(() => {
    inputLocation.trim().length > 0 ? setValidInput(true) : setValidInput(false)
  }, [inputLocation])

  useEffect(() => {
    let timeout = null;
    if (searchError) {
      timeout = setTimeout(() => {
        setSearchError(null)
      }, 3000)
    }

    return () => { timeout && clearTimeout(timeout) }
  }, [searchError])

  useEffect(() => {
    loadLocation()
  }, [])



  return (
    <>
      <View style={[styles.weatherAppContainer, !darkMode && styles.altWeatherAppContainer]}>
        <View style={styles.weatherAppWrapper} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadLocation()} />} >


          <ScrollView contentContainerStyle={styles.weatherData}>
            {
              !forecast || !spForecast || reloading ?
                <ActivityIndicator size="large" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
                :
                <>
                  <Text style={[styles.weatherTitle, altColorTheme && styles.altWeatherTitle, (windowWidth < 800 || windowHeight < 768) && { fontSize: Constants.fontLgg }]}>{forecast.name.toLocaleUpperCase()}</Text>
                  <View style={styles.weatherHeader}>
                    <View style={[styles.weatherPinLocation, altColorTheme && styles.altWeatherPinLocation, styles.weatherDateView]} ><Text style={[styles.weatherDateText, (windowWidth < 800 || windowHeight < 768) && { fontSize: Constants.fontSm }]}>{(new Date(forecast.dt * 1000)).toLocaleDateString('en-GB', { month: '2-digit', day: '2-digit' }).toLocaleUpperCase()}, {(new Date(forecast.dt * 1000)).toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit' })}</Text></View>

                    <TouchableOpacity style={[styles.weatherPinLocation, altColorTheme && styles.altWeatherPinLocation]} onPress={() => { reloadWeather() }} ><Foundation name="refresh" size={(windowWidth < 800 || windowHeight < 768) ? Constants.fontLgg : Constants.fontXl} color={Constants.colorWhite} /></TouchableOpacity>

                    <TouchableOpacity style={[styles.weatherPinLocation, altColorTheme && styles.altWeatherPinLocation]} onPress={() => { setModalVisible(true) }} ><Entypo name="location-pin" size={(windowWidth < 800 || windowHeight < 768) ? Constants.fontLgg : Constants.fontXl} color={Constants.colorWhite} /></TouchableOpacity>

                    <TouchableOpacity style={[styles.weatherPinLocation, altColorTheme && styles.altWeatherPinLocation]} onPress={() => { setCalendarModal(true); fetchExtendedForecast() }} ><Entypo name="calendar" size={(windowWidth < 800 || windowHeight < 768) ? Constants.fontLgg : Constants.fontXl} color={Constants.colorWhite} /></TouchableOpacity>
                  </View>

                  <View style={[styles.weatherTitleContainer, altColorTheme && styles.altWeatherTitleContainer, (windowWidth < 800 || windowHeight < 768) && { height: 220, minHeight: 220, maxHeight: 220 }]}>
                    <Text style={[styles.weatherTitleLocation, (windowWidth < 800 || windowHeight < 768) && { fontSize: Constants.fontMd }]}>{text.weather}</Text>
                    <View style={styles.weatherTitleContent}>
                      <View style={styles.weatherTitleImgWrapper}>
                        <Image style={[styles.weatherTitleImg, (windowWidth < 800 || windowHeight < 768) && { maxWidth: 180 }]} source={{ uri: `http://openweathermap.org/img/wn/${forecast?.weather[0].icon}@4x.png` }} />
                        <Text style={[styles.weatherTitleTemp, (windowWidth < 800 || windowHeight < 768) && { fontSize: Constants.fontMd }]}>{`${Math.trunc(Number(forecast.main.temp))} °C\n${Math.trunc((Number(forecast.main.temp) * (9 / 5)) + 32)} °F`}</Text>
                      </View>
                      <Text style={[styles.weatherTitleInfo, (windowWidth < 800 || windowHeight < 768) && { fontSize: Constants.fontMd }, { marginBottom: 20 }]}>
                        {languageSelected === "spanish" ? spForecast?.weather[0].description.toLocaleUpperCase() : forecast?.weather[0].description.toLocaleUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.rowItems, windowWidth > 800 && { flexDirection: 'row' }]}>
                    <View style={[styles.weatherTitleContainer, { height: 180, minHeight: 180, maxHeight: 180 }, windowWidth > 800 && { marginRight: 8, flex: 1 }, altColorTheme && styles.altWeatherTitleContainer, (windowWidth < 800 || windowHeight < 768) && { height: 134, minHeight: 134, maxHeight: 134 }]}>
                      <Text style={[styles.weatherTitleLocation, (windowWidth < 800 || windowHeight < 768) && { fontSize: Constants.fontMd }]}>{text.feels}</Text>
                      <View style={styles.weatherTitleContent}>
                        <View style={styles.weatherTitleImgWrapper}>
                          <Image style={[styles.weatherTitleImg, { maxWidth: 100 }, (windowWidth < 800 || windowHeight < 768) && { maxWidth: 80 }]} source={require('../assets/img/feels.png')} />
                          <Text style={[styles.weatherTitleTemp, { fontFamily: Constants.fontPrimary }, { padding: 20 }, (windowWidth < 800 || windowHeight < 768) && { fontSize: Constants.fontMd }]}>{`${Math.trunc(Number(forecast.main.feels_like))} °C\n${Math.trunc((Number(forecast.main.feels_like) * (9 / 5)) + 32)} °F`}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={[styles.weatherTitleContainer, { height: 180, minHeight: 180, maxHeight: 180 }, windowWidth > 800 && { marginLeft: 8, flex: 1 }, altColorTheme && styles.altWeatherTitleContainer, (windowWidth < 800 || windowHeight < 768) && { height: 134, minHeight: 134, maxHeight: 134 }]}>
                      <Text style={[styles.weatherTitleLocation, (windowWidth < 800 || windowHeight < 768) && { fontSize: Constants.fontMd }]}>{text.humidity}</Text>
                      <View style={styles.weatherTitleContent}>
                        <View style={styles.weatherTitleImgWrapper}>
                          <Image style={[styles.weatherTitleImg, { maxWidth: 100 }, (windowWidth < 800 || windowHeight < 768) && { maxWidth: 80 }]} source={require('../assets/img/humidity.png')} />
                          <Text style={[styles.weatherTitleTemp, { fontFamily: Constants.fontPrimary }, { padding: 20 }, (windowWidth < 800 || windowHeight < 768) && { fontSize: Constants.fontMd }]}>{`${forecast.main.humidity}%`}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </>
            }
          </ScrollView>
        </View>
      </View >

      {/* location modal */}
      <Modal visible={modalVisible} transparent={true} animationType='fade'>
        <SafeAreaView style={styles.modal}>
          <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
            <View style={[styles.modalTitle]}>
              <Text style={[styles.modalTitleText, searchError && { color: Constants.colorRed }]}>{searchError ? searchError : text.inputLocation}</Text>
              <KeyboardAvoidingView style={[styles.modalText, altColorTheme && styles.altModalText]}>

                <TextInput style={[styles.inputLocation, altColorTheme && styles.altInputLocation]} autoCapitalize='none' placeholder={forecast?.name.toLocaleUpperCase()}
                  placeholderTextColor={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} value={inputLocation} onChangeText={location => setInputLocation(location.toLocaleUpperCase())} onSubmitEditing={() => { location !== "" && fetchWeatherData(inputLocation.trim()); setInputLocation("") }} />

              </KeyboardAvoidingView>
            </View>
            <View style={styles.modalBtnContainer}>
              <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setModalVisible(false); setInputLocation(""); setSearchError(null) }}>
                <Text style={[styles.modalBtnText]}>{text.close}</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={refreshing || !validInput} style={[styles.modalBtn, altColorTheme && styles.altModalBtn, !validInput && styles.modalBtnDisabled]} onPress={() => { location !== "" && fetchWeatherData(inputLocation.trim()); setInputLocation("") }}>
                {refreshing ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : <Text style={[styles.modalBtnText, !validInput && styles.modalBtnTextDisabled]}>{text.search}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* calendar modal */}
      <Modal visible={calendarModal} transparent={true} animationType='fade'>
        <SafeAreaView style={styles.modal}>
          <View style={[styles.modalInner, !darkMode && styles.modalBorderDark, altColorTheme && styles.altModalInner]}>
            <View style={styles.modalTitle}>
              <Text style={styles.modalTitleText}>{text.forecast}: {forecast?.name?.toLocaleUpperCase()}</Text>
              <KeyboardAvoidingView style={[styles.modalText, altColorTheme && styles.altModalText, { minHeight: 340 }]}>
                {fetchingExtendedForecast ?
                  <ActivityIndicator size="large" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> :
                  <FlatList style={styles.calendarContainer}
                    data={languageSelected === 'spanish' ? spExtendedForecast?.list : extendedForecast?.list}
                    horizontal
                    /* pagingEnabled
                    snapToAlignment="start"
                    decelerationRate="fast" */
                    renderItem={({ item }) => {
                      const dt = new Date(item.dt * 1000)
                      return (
                        <View style={[styles.calendarItem, altColorTheme && styles.altCalendarItem]}>
                          <Text style={[styles.calendarItemDate, altColorTheme && styles.altCalendarItemDate]}>{dt.toLocaleDateString(languageSelected === 'spanish' ? 'es-ES' : 'en-GB', { weekday: 'short', month: '2-digit', day: '2-digit' }).toLocaleUpperCase()}, {dt.toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit' })}</Text>
                          <Text style={styles.calendarItemTemp}>{`${Math.trunc(Number(item.main.temp))} °C | ${Math.trunc((Number(forecast.main.temp) * (9 / 5)) + 32)} °F`}</Text>
                          <Image style={styles.calendarItemImg} source={{ uri: `http://openweathermap.org/img/wn/${item?.weather[0].icon}@4x.png` }} />
                          <Text style={styles.calendarForecast}>{item.weather[0].description.toLocaleUpperCase()}</Text>
                        </View>
                      )
                    }}
                    keyExtractor={(_, index) => index}
                  />
                }
              </KeyboardAvoidingView>
            </View>

            <View style={styles.modalBtnContainer}>
              <TouchableOpacity style={[styles.modalBtn, altColorTheme && styles.altModalBtn]} onPress={() => { setCalendarModal(false) }}>
                <Text style={[styles.modalBtnText]}>{text.close}</Text>
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
  weatherAppContainer: {
    flex: 1,
    backgroundColor: Constants.colorDark,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  weatherAppWrapper: {
    width: '100%',
    minWidth: 300,
    maxWidth: 800,
    flex: 1,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16
  },
  weatherDateView: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
    marginLeft: 0,
    paddingVertical: 4,
    width: 'auto'
  },
  weatherDateText: {
    color: Constants.colorWhite,
    fontSize: Constants.fontMd,
    fontFamily: Constants.fontPrimary
  },
  weatherPinLocation: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 2,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderColor: Constants.colorPrimaryDark,
    borderTopColor: Constants.colorPrimary,
    backgroundColor: Constants.colorPrimary,
    marginLeft: 8,
    width: 56,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
    height: 280,
    minHeight: 280,
    maxHeight: 280,
    marginBottom: 16,
  },
  weatherTitle:
  {
    fontFamily: Constants.fontPrimaryBold,
    color: Constants.colorPrimary,
    fontSize: Constants.fontXl,
    borderBottomColor: Constants.colorPrimary,
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 2
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
    fontFamily: Constants.fontPrimaryBold,
  },
  weatherTitleInfo: {
    color: Constants.colorWhite,
    fontSize: Constants.fontLg,
    textAlign: 'center',
    height: 36,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
  modalBtnDisabled: {
    borderColor: 'darkgray',
  },
  modalBtnText: {
    fontFamily: Constants.fontPrimary,
    fontSize: Constants.fontMd,
    color: Constants.colorWhite,
    textAlign: 'center',
  },
  modalBtnTextDisabled: {
    color: 'darkgray'
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
    borderBottomWidth: 4,
    borderBottomColor: Constants.colorPrimary,
    textAlign: 'center'
  },
  calendarContainer: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    padding: 10,
  },
  calendarItem: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Constants.colorWhite,
    backgroundColor: Constants.colorPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
    marginRight: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 200,
    minWidth: 200,
    maxWidth: 200,
    height: 294,
    minHeight: 294,
    maxHeight: 294
  },
  calendarItemImg: {
    width: '100%',
    maxWidth: 200,
    aspectRatio: 1,
  },
  calendarItemDate: {
    fontSize: Constants.fontSm,
    fontFamily: Constants.fontPrimary,
    color: Constants.colorPrimaryDark,
    width: '100%',
    textAlign: 'left'
  },
  calendarItemTemp: {
    fontSize: Constants.fontLg,
    fontFamily: Constants.fontPrimaryBold,
    color: Constants.colorWhite,
    width: '100%',
    textAlign: 'center'
  },
  calendarForecast: {
    fontSize: Constants.fontMd,
    fontFamily: Constants.fontPrimary,
    color: Constants.colorWhite,
    textAlign: 'center'
  },
  /* for dark mode off */
  altWeatherAppContainer: {
    backgroundColor: Constants.colorWhite,
  },
  /* for alt color mode */
  altWeatherTitleContainer: {
    borderColor: Constants.colorSecondaryDark,
    backgroundColor: Constants.colorSecondary,
  },
  altWeatherTitle: {
    color: Constants.colorSecondary,
    borderBottomColor: Constants.colorSecondary,
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
    borderTopColor: Constants.colorSecondary,
    backgroundColor: Constants.colorSecondary,
  },
  altInputLocation: {
    borderBottomColor: Constants.colorSecondary,
  },
  altCalendarItem: {
    backgroundColor: Constants.colorSecondary,
  },
  altCalendarItemDate: {
    color: Constants.colorSecondaryDark
  },
})