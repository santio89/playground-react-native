import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl, Image, Dimensions } from 'react-native'
import * as Location from 'expo-location'
import { useState, useEffect } from 'react'
import Constants from '../constants/Styles.js'
import { LANGS } from '../constants/Langs.js'
import { WEATHER_API_KEY } from '../constants/Database.js'
import Alert from '../utils/Alert'
import { useSelector } from 'react-redux'

const Weather = ({ navigation }) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${WEATHER_API_KEY}`

  const [forecast, setForecast] = useState(null)
  const [spForecast, setSpForecast] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const darkMode = useSelector(state => state.settings.darkMode.enabled)
  const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
  const { selected: languageSelected } = useSelector(state => state.settings.language)
  const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const updateWindowWidth = () => {
    setWindowWidth(Dimensions.get('window').width)
}

  const loadForecast = async () => {
    setRefreshing(true);
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert(`${text.locationPermissionDenied}`)
    } else {

      try {
        const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })

        try {
          const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`)
          const data = await response.json()

          if (!response.ok) {
            console.log("error fetching weather report ")
          } else {
            setForecast(data)
            console.log(data)
          }
        } catch (e) {
          console.log("error fetching weather data: ", e)
        }

        /* para otro idioma */
        try {
          const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}&lang=sp`)
          const data = await response.json()

          if (!response.ok) {
            console.log("error fetching sp weather report ")
          } else {

            setSpForecast(data)
          }
        } catch (e) {
          console.log("error fetching sp weather data: ", e)
        }

      } catch (e) {
        console.log("error getting geo position: ", e)
      }

      setRefreshing(false)
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
    loadForecast()
  }, [])

  /* forecast.current.weather[0] */
  return (
    <ScrollView contentContainerStyle={[styles.weatherAppWrapper, !darkMode && styles.altWeatherAppWrapper]}>
      <View style={styles.weatherAppContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadForecast()} />} >
        
        {
          !forecast ?
            <ActivityIndicator size="large" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} />
            :
            <View style={styles.weatherData}>
              <Text style={[styles.weatherTitle, altColorTheme && styles.altWeatherTitle]}>{forecast.name.toLocaleUpperCase()}</Text>
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

              <View style={[styles.rowItems, windowWidth>800 && {flexDirection: 'row'}]}>
                <View style={[styles.weatherTitleContainer, windowWidth>800 && {marginRight: 10, flex: 1}, altColorTheme && styles.altWeatherTitleContainer]}>
                  <Text style={styles.weatherTitleLocation}>{text.feels}</Text>
                  <View style={styles.weatherTitleContent}>
                    <View style={styles.weatherTitleImgWrapper}>
                      <Image style={[styles.weatherTitleImg, {maxWidth: 100}]} source={{ uri: `https://cdn-icons-png.flaticon.com/512/777/777610.png` }} />
                      <Text style={styles.weatherTitleTemp}>{`${Math.trunc(Number(forecast.main.feels_like))} °C\n${Math.trunc((Number(forecast.main.feels_like) * (9 / 5)) + 32)} °F`}</Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.weatherTitleContainer,windowWidth>800 && {marginLeft: 10, flex: 1}, altColorTheme && styles.altWeatherTitleContainer]}>
                  <Text style={[styles.weatherTitleLocation]}>{text.humidity}</Text>
                  <View style={styles.weatherTitleContent}>
                    <View style={styles.weatherTitleImgWrapper}>
                      <Image style={[styles.weatherTitleImg, {maxWidth: 100}]} source={{ uri: `https://cdn-icons-png.flaticon.com/512/5263/5263073.png` }} />
                      <Text style={styles.weatherTitleTemp}>{`${forecast.main.humidity}%`}</Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* <View style={styles.weatherExtraInfo}>
              <Text></Text>
            </View> */}
            </View>
        }


      </View>
    </ScrollView>
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
    minHeight: 300,
    maxHeight: 300,
    marginBottom: 20,
  },
  weatherTitle:
  {
    fontFamily: Constants.fontPrimaryBold,
    color: Constants.colorPrimary,
    fontSize: Constants.fontXl,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 40,
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
  /* for dark mode off */
  altWeatherAppWrapper: {
    backgroundColor: Constants.colorWhite,
  },
  altWeatherTitleContainer: {
    borderColor: Constants.colorSecondaryDark,
    backgroundColor: Constants.colorSecondary,
  },
  altWeatherTitle: {
    color: Constants.colorSecondary,
  },
})