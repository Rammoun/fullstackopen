import { useState, useEffect } from 'react'
import countriesService from './services/countries'
// import weatherService from './services/weather'

import Filter from './components/Filter'
import Countries from './components/Countries'

const App = () => {
  const [countries, setCountries] = useState([]) 
  // const [weather, setWeather] = useState(null) 
  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSelect = (country) => {
    // console.log(country)
    countriesService.selectCountry(country).then(response => {
      setCountries([response.data])
    })
  }

  useEffect(() => {
    countriesService.getAll().then(response => {
      setCountries(response.data)
      // console.log(response.data[0].name.common)
    })
  }, [])

  if (!countries) {
    return null
  }
  else{ 

    const toShow = filter
      ? countries.filter(country => country.name.common.toUpperCase().includes(filter.toUpperCase()))
      : countries;


    return (
      <div>
        <h1>Countries</h1>
        <Filter filter={filter} handleFilterChange={handleFilterChange} />
        <Countries toShow={toShow} handleSelect={handleSelect} />
      </div>
    )
}
}


export default App
