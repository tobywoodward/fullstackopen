import weatherService from '../services/weather.js'
import { useState, useEffect } from 'react'

const WeatherIcon = ({ weather }) => {
  const code = weather.icon
  const alt = weather.description
  const url = `https://openweathermap.org/img/wn/${code}@2x.png`
  return (
    <img src={url} alt={alt} />
  )
}

const Weather = ({ latlng }) => {
    const [weatherData, setWeatherData] = useState(null)
    const lat = latlng[0]
    const lon = latlng[1]

    useEffect(() => {
        weatherService.getAll({lat:lat, lon:lon})
        .then((inData) => {
          setWeatherData(inData)
        })
        .catch((error) => {
          console.log('My error: ', error)
        })
    }, [])

    if (!weatherData) {
      return null
    }
    // console.log(weatherData)
    const temp = (weatherData.main.temp - 273.15).toFixed(2)
    const wind = (weatherData.wind.speed).toFixed(2)
    return (
        <div>
          Temperature {temp} Celsius 
          <br/>
          <WeatherIcon weather={weatherData.weather[0]} />
          <br/>
          Wind {wind} m/s
        </div>
    )
}

export default Weather