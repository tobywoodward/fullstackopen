import axios from 'axios'
import { useState } from 'react'

const PersonForm = (props) => {
  const persons = props.persons
  const setPersons = props.setPersons
  const numbersService = props.numbersService

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
      // alert(`${newName} is already added to the phonebook`)
      if (window.confirm(`${newName} is already added to phonebook. Would you like to update the old number?`)) {
        const newPerson = {...(persons.find((person) => person.name === newName)), number: newNumber}
        console.log(`id is ${newPerson.id}`)
        numbersService.update(newPerson.id, newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id === newPerson.id ? returnedPerson : person))
        })
        .catch(error => {
          alert(`${newName} was already deleted from the server`)
          setPersons(persons.filter(p => p.id != newPerson.id))
        })
      }
    } else {
      numbersService.create({name : newName, number : newNumber}).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
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