import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl, Image } from 'react-native'
import * as Location from 'expo-location'
import { useState, useEffect } from 'react'
import Constants from '../constants/Styles.js'
import { LANGS } from '../constants/Langs.js'
import { WEATHER_API_KEY } from '../constants/Database.js'
import Alert from '../utils/Alert'
import { useSelector } from 'react-redux'

const Weather = ({ navigation }) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?units=metric&appid=${WEATHER_API_KEY}`

  const [forecast, setForecast] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const darkMode = useSelector(state => state.settings.darkMode.enabled)
  const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
  const { selected: languageSelected } = useSelector(state => state.settings.language)
  const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

  const loadForecast = async () => {
    setRefreshing(true);
    const { status } = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert(`${text.locationPermissionDenied}`)
    } else {
      const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
      const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`)
      const data = await response.json()
      
      if (!response.ok) {
        console.log("error fetching weather report ")
      } else {
        setForecast(data)
      }
    }

    setRefreshing(false)
  }

  useEffect(() => {
    loadForecast()
  }, [])

  /* forecast.current.weather[0] */
  return (
    <ScrollView contentContainerStyle={[styles.weatherAppWrapper, !darkMode && styles.altWeatherAppWrapper]}>
      <View style={styles.weatherAppContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadForecast()} />} >
        <Text style={[styles.weatherTitle, altColorTheme && styles.altWeatherTitle]}>{text.weatherReport}</Text>
        {!forecast ?
          <ActivityIndicator size="large" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> :
          <View style={styles.weatherData}>
            <View style={[styles.weatherTitleContainer, altColorTheme && styles.altWeatherTitleContainer]}>
              <Text style={styles.weatherTitleLocation}>{forecast.name.toLocaleUpperCase()}</Text>
              <View style={styles.weatherTitleImgWrapper}>
                <Image style={styles.weatherTitleImg} source={{ uri: `http://openweathermap.org/img/wn/${forecast?.weather[0].icon}.png` }} />

                <Text style={styles.weatherTitleTemp}>{`${forecast.main.temp} °C`}</Text>
              </View>
              <Text style={styles.weatherTitleInfo}>
                {forecast?.weather[0].main.toLocaleUpperCase()}
              </Text>
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
    flex: 1
  },
  weatherData: {
    flex: 1,
    justifyContent: 'center'
  },
  weatherTitleContainer: {
    borderRadius: 8,
    borderWidth: 4,
    borderColor: Constants.colorPrimaryDark,
    backgroundColor: Constants.colorPrimary,
    padding: 10
  },
  weatherTitle:
  {
    fontFamily: Constants.fontPrimaryBold,
    color: Constants.colorPrimary,
    fontSize: Constants.fontXl,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  weatherTitleLocation:
  {
    fontFamily: Constants.fontPrimaryBold,
    color: Constants.colorWhite,
    fontSize: Constants.fontLg,
    textAlign: 'center',
    alignSelf: 'flex-start',
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