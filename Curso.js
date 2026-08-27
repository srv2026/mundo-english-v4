
const mongoose = require("mongoose");

const cursoSchema = new mongoose.Schema({

    titulo: {
        type: String,
        required: true
    },

    descripcion: {
        type: String,
        required: true
    },

    video: {
        type: String,
        required: true
    },

    nivel: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("Curso", cursoSchema);
```
