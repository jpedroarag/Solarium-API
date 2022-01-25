const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true },
    htmlString: { type: String, require: true },
    createdBy: { type: String, require: true }
})

module.exports = mongoose.model("Lesson", lessonSchema)