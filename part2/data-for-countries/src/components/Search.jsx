const Search = ({ country, setCountry }) => {
    const handleCountryChange = (event) => {
        setCountry(event.target.value)
        // console.log(country)
    }
    return (
        <div>
            <form>
                find countries {' '}
                <input value={country} onChange={handleCountryChange} />
            </form>
        </div>
    )
}

export default Search