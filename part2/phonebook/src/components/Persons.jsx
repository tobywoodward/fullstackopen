const Persons = (props) => {
  const persons = props.persons
  const filter = props.filter
  return (
    <div>
    {persons.map(person => 
        <Person key={person.name} person={person} filter={filter}/>
      )}
    </div>
  )
}

const Person = (props) => {
  const lcaseName = props.person.name.toLowerCase()
  const lcaseFilter = props.filter.toLowerCase()
  if (lcaseName.includes(lcaseFilter)) {
    return(
      <div>
        {props.person.name} {props.person.number}
      </div>
    )
  }
}

export default Persons