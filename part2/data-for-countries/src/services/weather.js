import axios from 'axios'
const apiKey = import.meta.env.VITE_SOME_KEY

const getAll = ({ lat, lon }) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${apiKey}`
    const request = axios.get(url)
    return request.then(response => response.data)
}

const getIcon = ({ code }) => {
    const url = `https://openweathermap.org/img/wn/${code}@2x.png`
    const request = axios.get(url)
    return request.then(response => response.data)
}

export default { getAll, getIcon }