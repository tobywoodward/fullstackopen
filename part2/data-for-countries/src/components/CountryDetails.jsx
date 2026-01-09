import Weather from './Weather.jsx'

const CountryDetails = ({ country }) => {
    const LanguageList = ({ list }) => {
        const arr = Object.values(list)
        return (
            <div>
                {arr.map(lang => <li key={lang}>{lang}</li>)}
            </div>
        )
    }
    const languageList = Object.values(country.languages)
    return (
        <div>
            <h1>{country.name.common}</h1>
            Capital {country.capital[0]} <br />
            Area {country.area}
            <h2>Languages</h2>
            <ul>
                <LanguageList list={country.languages} />
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
            <h2>Weather in {country.capital[0]}</h2>
            <Weather latlng={country.capitalInfo.latlng} />
        </div>
    )
}

export default CountryDetails