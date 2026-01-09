import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Persons from './components/Persons.jsx'
import numbersService from './services/numbers.js'
import Confirmation from './components/Confirmation.jsx'
import Error from './components/Error.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    numbersService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])


  const [filter, setFilter] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <Confirmation message={confirmation} />
      <Error message={error} />
      <Filter filter={filter} setFilter={setFilter}/>
      <h2>Add new contact</h2>
      <PersonForm persons={persons} setPersons={setPersons} numbersService={numbersService} setConfirmation={setConfirmation} setError={setError} />
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} filter={filter} numbersService={numbersService} />
    </div>
  )
}

export default App