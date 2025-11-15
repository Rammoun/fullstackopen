import axios from 'axios'
const api_key = import.meta.env.VITE_API_KEY
const weateherUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric'

const getWeather = (capital) => {
    return axios.get(`${weateherUrl}&q=${capital}&appid=${api_key}`)
}

export default {getWeather}