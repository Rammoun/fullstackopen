import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Form from './components/Form'
import Notification from './components/Notification'
import axios from 'axios'
import personsService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationClassName, setNotificationClassName] = useState('')

  useEffect(() => {
    console.log('effect')
    personsService.getAll().then(response => {
      setPersons(response.data)
      console.log(persons)
    })
  }, [])

  const handleDelete = (id, name) => {
    if(window.confirm(`Delete ${name}?`)){
      personsService.del(id)
        .then(response => {
          setPersons(persons.filter(person => person.id!=id))
          setNotificationMessage(`Deleted ${name}`)
          setNotificationClassName('success')
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            setNotificationMessage(`Information of ${name} has already been removed from server`)
            // setPersons(persons.filter(p => p.id !== id))
            personsService.getAll().then(response => {
              setPersons(response.data)
            })
          } else {
            setNotificationMessage(`Failed to delete ${name}`)
          }
          setNotificationClassName('error')
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    if(persons.map(person => person.name==newName).includes(true)){
      // alert(`${newName} is already added to phonebook`)
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const person = persons.find(person => person.name==newName)
        const changedPerson = { ...person, number: newNumber }
        personsService.update(person.id, changedPerson)
          .then(response => {
            setPersons(persons.map(person => person.id!=changedPerson.id ? person : response.data))
            setNotificationMessage(`Updated ${changedPerson.name}'s number`)
            setNotificationClassName('success')
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              setNotificationMessage(`Information of ${newName} has already been removed from server`)
              setPersons(persons.filter(p => p.id !== person.id))
            } else {
              setNotificationMessage(error.response.data.error || `Failed to update ${newName}`)
            }
            setNotificationClassName('error')
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
      } 
    }
    else{
      // setPersons(persons.concat({ name: newName, number: newNumber }))
      const personObject = { name: newName, number: newNumber } 
      personsService.create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
            setNotificationMessage(`Added ${newName}`)
            setNotificationClassName('success')
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log('Failed to add person')
          setNotificationMessage(`Failed to add ${newName}`)
          setNotificationClassName('error')
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const toShow = filter
    ? persons.filter(person => person.name.toUpperCase().includes(filter.toUpperCase()))
    : persons;
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} className={notificationClassName}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <Form addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons toShow={toShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App