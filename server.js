const path = require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

require("dotenv").config()

const express = require("express")
const app = express()

const signin = require("./auth/signin")
const signup = require("./auth/signup")

function setupDependencies(app, bodyParser, path) {
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.set("port", process.env.PORT || 3000)
}

function connectToDatabaseAndSetEndpoints(app, mongoose) {
    const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`
    mongoose.connect(url, { useNewUrlParser: true })
    mongoose.connection.once("open", _ => {
        app.post("/signin", signin.action)
        app.post("/signup", signup.action)
    })
}

setupDependencies(app, bodyParser, path)
connectToDatabaseAndSetEndpoints(app, mongoose)

app.get("/", (request, response) => {
    response.send({ message: "Welcome to Solarium-API!" })
})
const server = app.listen(app.get("port"), () => {
    console.log("Listening on port: ", server.address().port)
})