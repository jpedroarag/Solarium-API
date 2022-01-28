const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const ResetToken = require("../models/resetToken")
const User = require("../models/user")
const email = require("./email")
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

exports.sendPasswordResetLink = (request, response) => {
    User.findOne({ email: request.body.email }, (error, user) => {
        if(error) {
            return response.status(500).send({ message: "Erro interno." })
        }
        if(!user) {
            return response.status(400).send({ message: "Email informado não cadastrado." })
        }

        ResetToken.findOne({ requestedBy: user._id }, (error, token) => {
            if(token) { 
                token.deleteOne()
            }
            const resetToken = crypto.randomBytes(32).toString("hex")
            const hash = bcrypt.hashSync(resetToken, 10)
            
            new ResetToken({
                hash: hash,
                resetToken: resetToken,
                requestedBy: user._id,
                createdAt: new Date()
            }).save(error => {
                if(error) {
                    return response.status(500).send({ message: "Erro interno." })
                }
                const link = `${process.env.RESET_PASS_CLIENT_URL}?token=${resetToken}&id=${user._id}`
                const resetPasswordEmailInfo = {
                    from: process.env.MAIL_USER,
                    to: user.email,
                    subject: "Redefinir senha",
                    html: `<p>Olá ${user.name}!<br/>Para redefinir sua senha, basta clicar no link abaixo:<br/><a href=\"${link}\">Redefinir senha</a></p>`
                }
                email.mailer.sendMail(resetPasswordEmailInfo)
                .then(info => console.log(`Enviado com sucesso para ${user.email}.`) )
                .catch(error => console.log(error))
                response.status(200).send({ resetLink: link })
            })
        })
    })
}

exports.resetPassword = (request, response) => {
    const json = request.body
    const resetToken = json.token

    ResetToken.find({ requestedBy: json.id }, (error, dbResetTokens) => {
        if(!dbResetTokens || error) {
            return response.status(408).send({ message: "Link expirado ou inválido!" })
        }

        const dbResetToken = dbResetTokens.find(element => bcrypt.compareSync(resetToken, element.hash))

        if(!dbResetToken) {
            return response.status(400).send({ message: "Link inválido!" })
        }

        const currentDate = new Date()
        const tokenCreationDate = new Date(dbResetToken.createdAt)

        const timeOffset = Math.abs(currentDate - tokenCreationDate)
        const hours = timeOffset/(1000 * 60 * 60)
        
        if(hours < 1) {
            const newPassword = bcrypt.hashSync(json.password, 8)
            User.findOneAndUpdate(
                { _id: json.id }, 
                { password: newPassword }, 
                { new: true },
                (error, user) => {
                if(error) {
                    response.status(400).send({ message: "Link inválido!" })
                }
                dbResetToken.deleteOne()
                this.authenticate(user, response)
            })
        } else {
            response.status(408).send({ message: "Link expirado!" })
        }
    })
}