const Persons = (props) => {
  const persons = props.persons
  const filter = props.filter
  const filteredPersons = (persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())))

  return (
    <div>
    {filteredPersons.map(person =>
      <Person key={person.id} {...props} person={person} />
    )}
    </div>
  )
}

const Person = (props) => {
  const person = props.person

  const handleDeletion = (event) => {
    event.preventDefault()
    if (window.confirm(`Delete ${person.name}?`)) {
    
      console.log(`deleting ${person.name}`)
      props.numbersService.deletePerson(person.id)
      .then(() => {
        const updatedPersons = (props.persons.filter(
          current => current.id != person.id
        ))
        props.setPersons(updatedPersons)
      })
      .catch(error => {
        // console.log(error)
        alert(`${person.name} was already deleted from the server`)
      })
    } else { console.log('deletion cancelled')}
  }

  // if (lcaseName.includes(lcaseFilter)) {
  return(
    <div>
      {person.name} {person.number}
      <button onClick={handleDeletion}>Delete</button>
    </div>
  )
  // }
}

export default Persons