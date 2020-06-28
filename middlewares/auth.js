const jwt = require("jsonwebtoken")

function auth(request, response, next) {
    const authToken = request.headers['authorization']
    
    if (authToken != undefined) {
        let token = authToken.split(' ')[1]
        jwt.verify(token, "adflkahsdfliawhfbesq9834754ae@*#&¨%$", (error, data) => {
            if (error) {
                response.status(400)
                response.json({
                    error: "Token Invalido"
                })
            } else {
                request.token = token
                request.loggedUser = {
                    id: data.id,
                    email: data.email,
                    name: data.name
                }

                next()
            }
        })
    } else {
        response.statusCode = 400
        response.json({
            error: "Token De Autenticação Não Encontrado!"
        })
    }
}

module.exports = auth