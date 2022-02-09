const bcrypt = require("bcryptjs")
const User = require("../models/user.js")
const authentication = require("./authentication")
const email = require("./email")
require("dotenv").config()

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
            password: bcrypt.hashSync(json.password, 8),
            isVerified: false
        })
        user.save(error => {
            if(error) {
                return response.status(500).send({ error: error })
            }
            const link = `${process.env.VERIFY_EMAIL_CLIENT_URL}/${user._id}`
            const verifyEmailInfo = {
                from: process.env.MAIL_USER,
                to: user.email,
                subject: "Verificação de email",
                html: `<p>Olá ${user.name}!<br/>Para verificar seu email, basta clicar no link abaixo:<br/><a href=\"${link}\">Verificar email</a></p>`
            }
            email.mailer.sendMail(verifyEmailInfo)
            .then(info => console.log(`Enviado com sucesso para ${user.email}.`) )
            .catch(error => console.log(error))
            response.status(200).send({ verifyEmailLink: link })
            //authentication.authenticate(user, response)
        })
    })
}