const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.action = (user, response) => {
    const token = jwt.sign(
        { id: user._id }, 
        process.env.AUTH_SECRET, 
        { expiresIn: 60 * 60 * 24 }
    )
    response.status(200).send({
        name: user.name,
        username: user.username,
        accessToken: token
    })
}