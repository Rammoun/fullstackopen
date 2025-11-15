import OneCountry from "./OneCountry"

const Countries = (props) => {
    if(props.toShow.length > 10){
        return(
            <div>Too many matches, specify another filter</div>
        )
    }
    else if(props.toShow.length === 1){
        return(<OneCountry country={props.toShow[0]} />)
    }
    else{
        return(
            <ul>
                {props.toShow.map((country) =>
                    <li key={country.cca2}>
                        {country.name.common}
                        <button type="button" onClick={() => props.handleSelect(country.name.common)}>Select</button>
                    </li>
                )}
            </ul>
        )
    }
}

export default Countries;