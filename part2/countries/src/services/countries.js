import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
  return axios.get(baseUrl+`/all`)
}

const selectCountry = (country) => {
  return axios.get(baseUrl+'/name/'+country)
}

export default {getAll,selectCountry}