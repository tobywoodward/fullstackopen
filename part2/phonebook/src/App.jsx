import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import axios from 'axios'
import numbersService from './services/numbers.js'

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    numbersService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])


  const [filter, setFilter] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter}/>
      <h2>Add new contact</h2>
      <PersonForm persons={persons} setPersons={setPersons} numbersService={numbersService}/>
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} filter={filter} numbersService={numbersService} />
    </div>
  )
}

export default App