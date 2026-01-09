import CountryDetails from './CountryDetails'

const countryName = (country) => {
    const name = country.name.common
    // console.log(name)
    return (
        name
    )
}

// const ListCountry = (props) => {
//     const country = props.country
//     return (
//         <li>
//             {country}
//         </li>
//     )
// }

const ListCountry = ({ name, setCountry }) => {
    const handleButtonPress = () => {
        setCountry(name)
    }
    return (
        <li>
            {name} {" "}
            <button onClick={handleButtonPress}>Show</button>
        </li>
    )
}

const ListCountries = ({ country, setCountry, countryList }) => {
    const filteredList = (countryList.filter(c => 
        countryName(c).toLowerCase().includes(country.toLowerCase()))
    )

    // const [selected, setSelected] = useState('')

    if (filteredList.length > 10) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else if (filteredList.length === 1) {
        return (
            <div>
                <CountryDetails country={filteredList[0]} />
            </div>
        )
    } else if (filteredList.length === 0) {
        return (
            <div>
                No matches
            </div>
        )
    } else {
        return (
            <div>
                {filteredList.map(c => <ListCountry key={countryName(c)} name={countryName(c)} setCountry={setCountry} />)}
            </div>
        )
    }
}

export default ListCountries