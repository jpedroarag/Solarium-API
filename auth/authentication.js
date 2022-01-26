const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.authenticate = (user, response) => {
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

exports.verifyToken = (request, response, next) => {
    let token = request.headers["x-access-token"]

    if(!token) {
        return response.status(403).send({ message: "Nenhum token fornecido." })
    }

    jwt.verify(token, process.env.AUTH_SECRET, (error, decoded) => {
        if(error) {
            return response.status(401).send({ message: "Unauthorized." })
        }
        request.userId = decoded.id
        next()
    })
}