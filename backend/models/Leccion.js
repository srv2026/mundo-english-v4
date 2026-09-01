const mongoose = require("mongoose");

const leccionSchema = new mongoose.Schema({

    cursoId: {
        type: String,
        required: true
    },

    titulo: {
        type: String,
        required: true
    },

    video: {
        type: String,
        required: true
    },

    orden: {
        type: Number,
        default: 1
    }

});

module.exports = mongoose.model(
    "Leccion",
    leccionSchema
);