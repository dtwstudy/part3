const mongoose = require('mongoose')


if (process.argv.length<3) {
  console.log('give password  as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const num = process.argv[4]


const url =`mongodb+srv://fullstack:${password}@cluster0.rncmfno.mongodb.net/personsApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)
const noteSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  
  
  const Person = mongoose.model('Person', noteSchema)
if(process.argv.length >3){
    const person = new Person({
        name: name,
        number: num,
      })
      
      person.save().then(result => {
        console.log(`added ${name} number ${num} to phonebook`)
        mongoose.connection.close()
      })
}
else{
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })

}




