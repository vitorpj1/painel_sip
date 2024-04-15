const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require("express-session")
const connection = require('./database/database')

//sessions
let minute = 60000
app.use(session({
    secret: '404error',
    cookie:{
        maxAge: minute * 60
    }
}))

//view
app.set('view engine','ejs');
//static
app.use(express.static('public'))

//body parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//database
connection
    .authenticate()
    .then(()=>{
        console.log('Conexao feita com sucesso.')
    }).catch((error)=>{
        console.log(error)
    })


//routes controllers
const usuarioController = require("./usuario/UsuarioController")
app.use('/',usuarioController)

const adminController = require("./admin/AdminController")
app.use('/',adminController)


//routes iniciais
app.get('/',(request,response)=>{
    response.redirect('/login')
})



app.listen(3000,()=>{
    console.log('Servidor rodando.')
})

