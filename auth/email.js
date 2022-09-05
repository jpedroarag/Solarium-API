const nodemailer = require("nodemailer")
require("dotenv").config()

exports.mailer = nodemailer.createTransport({
    host: process.env.MAIL_SERVICE_URL,
    service: process.env.MAIL_SERVICE_URL,
    port: process.env.MAIL_SERVICE_PORT * 1,
    secure: (process.env.MAIL_SERVICE_ISSECURE === 'true'),
    tls: {
        ciphers: process.env.MAIL_SERVICE_TLSCIPHERS
    },
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})