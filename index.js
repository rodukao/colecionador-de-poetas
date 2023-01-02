//PATH
const path = require('path');
const publicDirectory = path.join(__dirname, './public')

//EXPRESS
const express = require('express')
const app = express()
app.set('view engine', 'hbs')

//DOVENV
require('dotenv').config()

app.use(express.static(publicDirectory))
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/auth', require('./routes/auth'))
app.use('/', require('./routes/auth'))
app.use('/data', require('./routes/data'))

app.listen(3001, () => {
    console.log(`Example app listening on port 3001`)
  })