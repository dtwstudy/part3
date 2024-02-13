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

const errorHandler = (error, request, response, next) => {
   
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
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

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if(person){
             res.json(person)
        }
        else{
            res.status(404).end()
        }
       
      }).catch(error => next(error) )

    })

    app.put('/api/persons/:id', (req, res, next) => {
        Person.findByIdAndUpdate(req.params.id, { number: req.body.number },{ new: true }).then(person => {
            if(person){
                 res.json(person)
            }
            else{
                res.status(404).end()
            }
           
          }).catch(error => next(error) )
    
        })

app.delete('/api/persons/:id', (request, response,next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(res=>{
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    Person.findOne({name: body.name}).then(person=>{
        if(person == null){
            if (!body.number) 
         return res.status(400).json({error: 'number missing'})

         const person = new Person({name: body.name, number: body.number, })
    
            person.save().then(savedPerson => {
               return res.json(savedPerson)
            })
        }
        else{
              return res.status(400).json({ error: 'name must be unique' })
        }
      
   
   })

})


app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})