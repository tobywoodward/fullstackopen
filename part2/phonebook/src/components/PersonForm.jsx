import { useState } from 'react'

const PersonForm = (props) => {
  const persons = props.persons
  const setPersons = props.setPersons

  const [newName, setNewName] = useState('')
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const [newNumber, setNewNumber] = useState('')
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    // console.log('button clicked', event.target)
    if (persons.some((person) => person.name === newName)){
      alert(`${newName} is already added to the phonebook`)
    } else {
      setPersons(persons.concat({name: newName, number: newNumber}))
      setNewName('')
      setNewNumber('')
    }
  }

  return (
  <form onSubmit={addPerson}>
    <div>
      Name
      <input 
        value={newName}
        onChange={handleNameChange}  
      />
      <br/>
      Number
      <input 
        value={newNumber}
        onChange={handleNumberChange}  
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

export default PersonForm