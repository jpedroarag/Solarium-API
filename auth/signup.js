const bcrypt = require("bcryptjs")
const User = require("../models/user.js")
const authenticate = require("./authenticate")

exports.action = (request, response) => {
    const json = request.body
    const user = new User({
        name: json.name,
        email: json.username,
        password: bcrypt.hashSync(json.password, 8)
    })
    user.save(error => {
        if(error) {
            return response.status(500).send({ message: error })
        }
        authenticate.action(user, response)
    })
}