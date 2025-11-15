import { useState, useEffect } from 'react'
import weatherService from '../services/weather'

const OneCountry = (props) => {
    
    const [weather, setWeather] = useState(null) 
    useEffect(() => {
        weatherService.getWeather(props.country.capital).then(response => {
          setWeather(response.data)
        })
    }, [])
    
    
    if (!weather) return null
    else{
        let iconSrc='https://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png'
        return(
            <div>
                <h1>{props.country.name.common}</h1>
                <p>Capital {props.country.capital}</p>
                <p>Area {props.country.area}</p>
                <h3>Languages:</h3>
                <ul>
                    {Object.values(props.country.languages).map((language) =>
                        <li key={language}>{language}</li>
                    )}
                </ul>
                <img src={props.country.flags.png} alt={props.country.flags.alt} />
                <h3>Weather in {props.country.capital}</h3>
                <p>Temperature {weather.main.temp} celsius</p>
                <p>Wind {weather.wind.speed} m/s</p>
                <img src={iconSrc} alt={weather.weather[0].description} />
            </div>
        )
    }            
}

export default OneCountry;