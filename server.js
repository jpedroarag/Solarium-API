const path = require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

require("dotenv").config()

const express = require("express")
const app = express()

const authentication = require("./auth/authentication")
const signin = require("./auth/signin")
const signup = require("./auth/signup")

const lessonCrud = require("./lessons/lessonCrud")

function setupDependencies(app, bodyParser, path) {
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.set("port", process.env.PORT || 3001)
    app.use((request, response, next) => {
        response.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        response.header(
            "Access-Control-Allow-Origin", "*"
        )
        next()
    })
}

function connectToDatabaseAndSetEndpoints(app, mongoose) {
    const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`
    mongoose.connect(url, { useNewUrlParser: true })
    mongoose.connection.once("open", _ => {
        app.post("/auth/signin", signin.action)
        app.post("/auth/signup", signup.action)
        app.post("/auth/sendPasswordResetLink", authentication.sendPasswordResetLink)
        app.post("/auth/resetPassword", authentication.resetPassword)
        app.get("/lessons/fetch", [authentication.verifyToken, lessonCrud.fetchAll])
        app.post("/lessons/create", [authentication.verifyToken, lessonCrud.createLesson])
        app.post("/lessons/update", [authentication.verifyToken, lessonCrud.editLesson])
        app.post("/lessons/delete", [authentication.verifyToken, lessonCrud.removeLesson])
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