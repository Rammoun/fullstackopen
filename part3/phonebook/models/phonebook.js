// const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('Not enough arguments', process.argv)
//   process.exit(1)
// }

// // const password = process.argv[2]
// const url = process.env.MONGODB_URI

// mongoose.set('strictQuery',false)

// console.log('connecting to', url)
// mongoose.connect(url, { family: 4 })
//   .then(result => {
//     console.log('connected to MongoDB')
//   })
//   .catch(error => {
//     console.log('error connecting to MongoDB:', error.message)
//   })

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// })

// const Person = mongoose.model('Person', personSchema)

// if (process.argv.length === 3) {
//   Person.find({}).then(result => {
//     console.log('phonebook:')
//     result.forEach(person => {
//       console.log(`${person.name} ${person.number}`)
//     })
//     mongoose.connection.close()
//   })
// }

// if (process.argv.length === 5) {
//     const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//     })

//     person.save().then(result => {
//     console.log(`added ${person.name} number ${person.number} to phonebook`)
//     mongoose.connection.close()
//     })
// }

// personSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// module.exports = mongoose.model('Person', personSchema)






const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String, // Note: You used 'phone' here, but make sure your frontend sends 'phone' or 'number'. Consistency is key.
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)