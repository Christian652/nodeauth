const express = require("express")
const User = require("../models/User")
const router = express.Router()
const jwt = require("jsonwebtoken")
const jwtSecret = "adflkahsdfliawhfbesq9834754ae@*#&¨%$"
const bcrypt = require("bcryptjs")

router.post("/Auth", (request, response) => {
    var {email, password} = request.body

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != undefined) {
            if (email == user.email) {
                var correct = bcrypt.compareSync(password, user.password)
                
                if (correct) {
                    jwt.sign({
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }, jwtSecret, {expiresIn: '48h'}, (error, token) => {
                        if (error) {
                            response.statusCode = 500
                            response.json({
                                data: {
                                    msg: "erro ao gerar token jwt"
                                }
                            })
                        } else {
                            response.statusCode = 200
                            response.json({token})
                        }
                    })
                } else {
                    response.statusCode = 400
                    response.json({
                        data: {
                            msg: "As Senhas Não Batem!"
                        }
                    })    
                }
            } else {
                response.statusCode = 400
                response.json({
                    data: {
                        msg: "O Email Não Corresponde A Nenhum Usuario"
                    }
                })
            }
        } else {
            response.statusCode = 404
            response.json({
                data: {
                    msg: "Usuario não encontrado!"
                }
            })
        }
    }).catch(error => {
        response.statusCode = 400
        response.json({
            data: {
                msg: "Erro Ao Buscar Usuario",
                error
            }
        })
    })
})

module.exports = router
