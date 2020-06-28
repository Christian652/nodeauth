const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const auth = require("../middlewares/auth")

router.get("/", auth,(request, response) => {
    User.findAll({
        raw: true,
        order: [
            ["id", "DESC"]
        ]
    }).then(users => {
        response.statusCode = 200
        response.json({
            data: {
                users: users
            }
        })
    }).catch(error => {
        response.statusCode = 400
        response.json({
            data: {
                msg: "Erro Ao Procurar Usuarios Na Api",
                error: error
            }
        })
    })  
})

router.get("/:id", auth,(request, response) => {
    User.findOne({
        where: {
            id: request.params.id
        }
    }).then(user => {
        if (user != null) {
            response.statusCode = 200
            response.json({
                data: {
                    user
                }
            })
        } else {
            response.statusCode = 404
            response.json({
                data: {
                    msg: "Nenhum Usuário Encontrado Com Esse Id!"
                }
            })
        }
    }).catch(error => {
        response.statusCode = 400
        response.json({
            data: {
                msg: "Erro Ao Buscar Usuario!",
                error: error
            }
        })
    })  
})

router.post("/", auth,(request, response) => {
    var {name , email , password} = request.body;
    
    if (name != undefined && email != undefined && password != undefined) {
        var salt = bcrypt.genSaltSync(10)
        var hash = bcrypt.hashSync(password, salt)
        
        User.findOne({where: {email: email}}).then(user => {
            if (user == undefined) {
                User.create({
                    name,
                    email,
                    password: hash
                }).then(() => {
                    response.statusCode = 200
                    response.json({
                        data: {
                            msg: "Registro Bem Sucedido!"
                        }
                    })
                }).catch(error => {
                    response.statusCode = 400
                    response.json({
                        data: {
                            msg: "Registro Mal Sucedido",
                            error
                        }
                    })
                })
            } else {
                response.statusCode = 400
                response.json({
                    data: {
                        msg: "Esse Email Ja Está Sendo Usado"
                    }
                })
            }
        })
    }
})

router.put("/", auth,(request, response) => {
    let id = request.body.id

    var {name , email , password} = request.body;

    var salt = bcrypt.genSaltSync(10)
    var hash = bcrypt.hashSync(password, salt)

    User.update({
        name,
        email,
        password: hash
    }, {
        where: {
            id
        }
    }).then(() => {
        response.statusCode = 200
        response.json({
            data: {
                msg: "Edição Bem Sucedida!"
            }
        })
    }).catch(error => {
        response.statusCode = 400
        response.json({
            data: {
                msg: "Edição Mal Sucedida",
                error
            }
        })
    })
})

router.delete("/", auth,(request, response) => {
    let id = request.body.id

    User.destroy({
        where: {
            id
        }
    }).then(() => {
        response.statusCode = 200
        response.json({
            data: {
                msg: "Deleção Bem Sucedida"
            }
        })
    }).catch(error => {
        response.statusCode = 400
        response.json({
            data: {
                msg: "Deleção Mal Sucedida",
                error
            }
        })
    })
})


module.exports = router;