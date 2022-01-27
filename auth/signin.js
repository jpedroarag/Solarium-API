const bcrypt = require("bcryptjs")
const User = require("../models/user")
const authentication = require("./authentication")

exports.action = (request, response) => {
    const json = request.body
    
    User.findOne({ email: json.email }, (error, user) => {
        if(error) {
            return response.status(500).send({ message: error })
        }

        if(!user) {
            return response.status(404).send({ message: "Usuário não encontrado." })
        }
        
        const isPasswordValid = bcrypt.compareSync(json.password, user.password)

        if(!isPasswordValid) {
            return response.status(401).send({
                accessToken: null,
                message: "Senha inválida."
            })
        }

        authentication.authenticate(user, response)
    })
}