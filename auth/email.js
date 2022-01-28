const nodemailer = require("nodemailer")
require("dotenv").config()

exports.mailer = nodemailer.createTransport({
    host: process.env.MAIL_SERVICE_URL,
    service: process.env.MAIL_SERVICE_URL,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})