const Filter = (props) => {
  const { filter, setFilter } = props
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    // console.log('filter', filter)
  }
  return (
    <form>
        Search
        <input value={filter} onChange={handleFilterChange}/>
      </form>
  )
}

export default Filter