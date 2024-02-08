const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
morgan.token('id', function getId(req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':id :method :url :response-time'))




let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },


]

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0
    return maxId + 1
}



app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length}  people<br>${date}</p>`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(person => {
        res.json(person)
      })
    
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const findName = persons.filter((person) => person.name == body.name)
    if (findName.length > 0) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    if (!body.number) {

        return res.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        
        name: body.name,
        number: body.number,

    })
    person.save().then(savedPerson => {
        res.json(savedPerson)
      })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})