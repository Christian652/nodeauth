const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database")
const User = require("./models/User")
const Cors = require("cors")

//Controllers
const AuthController = require("./controllers/AuthController")
const UsersController = require("./controllers/UsersController")

//Body parser

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors
app.use(Cors())

//Conexão

connection.authenticate()
    .then(() => {
        console.log(`
        |=========================|
        |Banco De Dados Conectado |
        |=========================|    
        `)
     }).catch(Error => {
        console.log(error)
    })

// Router

    app.get("/", (request, response) => {
        response.json({
            data: {
                msg: "Api Inicializada"
            }
        })
    })

    app.use("/Users", UsersController)
    app.use("/", AuthController)
// End Router

app.listen(5454, () => {
    console.log("O servidor está rodando!")
})