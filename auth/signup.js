const bcrypt = require("bcryptjs")
const User = require("../models/user.js")
const authentication = require("./authentication")

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

exports.action = (request, response) => {
    const json = request.body
    const isEmailValid = validateEmail(json.email)

    if(!isEmailValid) {
        return response.status(400).send({ error: "Formato de email não suportado." })
    }

    User.findOne({ email: request.body.email }, (error, dbUser) => {
        if(dbUser) {
            return response.status(400).send({ error: "Usuário já cadastrado com o email informado." })
        }
        const user = new User({
            name: json.name,
            email: json.email,
            password: bcrypt.hashSync(json.password, 8)
        })
        user.save(error => {
            if(error) {
                return response.status(500).send({ error: error })
            }
            authentication.authenticate(user, response)
        })
    })
}