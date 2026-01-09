import Search from './components/Search'
import ListCountries from './components/ListCountries'
import countriesService from './services/countries.js'
import { useState, useEffect } from 'react'

const App = () => {
  const [country, setCountry] = useState('')
  const [countryList, setCountryList] = useState(null)
  useEffect(() => {
    countriesService.getAll()
    .then((initialList) => {
      setCountryList(initialList)
      // console.log('countries loaded', countryList[0].name.common)
    })
    .catch((error) => {
      console.log('My error: ', error)
    })
  }, [])
  if (!countryList) {
    return null
  }
  return (
    <div>
      <Search country={country} setCountry={setCountry} />
      <ListCountries country={country} setCountry={setCountry} countryList={countryList} />
    </div>
  )
}

export default App
