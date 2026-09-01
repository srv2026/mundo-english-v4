const mongoose = require("mongoose");

const progresoSchema = new mongoose.Schema({

    usuario: {
        type: String,
        required: true
    },

    cursoId: {
        type: String,
        required: true
    },

    curso: {
        type: String,
        required: true
    },

    porcentaje: {
        type: Number,
        default: 0
    }

});

module.exports = mongoose.model(
    "Progreso",
    progresoSchema
);