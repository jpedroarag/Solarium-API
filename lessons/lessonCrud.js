const Lesson = require("../models/lesson.js")

exports.fetchAll = (request, response) => {
    Lesson.find({ createdBy: request.userId }, (error, lessons) => {
        if(error) {
            return response.status(500).send({ message: error })
        }
        
        if(!lessons) {
            return response.status(404).send({ message: "Usuário não encontrado." })
        }

        response.status(200).send(lessons)
    })
}

exports.createLesson = (request, response) => {
    const json = request.body
    const lesson = new Lesson({
        name: json.name,
        htmlString: json.htmlString,
        createdBy: request.userId,
        createdAt: new Date()
    })
    lesson.save(error => {
        if(error) {
            return response.status(500).send({ message: error })
        }
        response.status(200).send(lesson)
    })
}

exports.removeLesson = (request, response) => {
    Lesson.deleteOne({ name: request.body.name }, (error) => {
        if(error) {
            return response.status(500).send({ message: error })
        }
        response.status(200).send({ message: "Removido com sucesso." })
    })
}

exports.editLesson = (request, response) => {
    const filter = { name: request.body.name }
    const update = request.body.update
    Lesson.findOneAndUpdate(filter, update, { new: true }, (error, lesson) => {
        if(error) {
            return response.status(500).send({ message: error })
        }

        if(!lesson) {
            return response.status(404).send({ message: "Aula não encontrada." })
        }

        response.status(200).send(lesson)
    })
}