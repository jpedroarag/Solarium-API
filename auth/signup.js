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
        return response.status(400).send({ message: "Formato de email não suportado." })
    }

    const user = new User({
        name: json.name,
        email: json.email,
        password: bcrypt.hashSync(json.password, 8)
    })
    user.save(error => {
        if(error) {
            return response.status(500).send({ message: error })
        }
        authentication.authenticate(user, response)
    })
}