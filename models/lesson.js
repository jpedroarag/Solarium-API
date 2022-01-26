const { ObjectId } = require("mongodb")
const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    htmlString: { type: String, require: true },
    createdBy: { type: ObjectId, require: true },
    createdAt: { type: Date, require: true }
})

module.exports = mongoose.model("Lesson", lessonSchema)