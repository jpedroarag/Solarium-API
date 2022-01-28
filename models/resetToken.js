const { ObjectId } = require("mongodb")
const mongoose = require("mongoose")

const resetTokenSchema = new mongoose.Schema({
    hash: { type: String, require: true },
    requestedBy: { type: ObjectId, require: true },
    createdAt: { type: Date, require: true }
})

module.exports = mongoose.model("ResetToken", resetTokenSchema)