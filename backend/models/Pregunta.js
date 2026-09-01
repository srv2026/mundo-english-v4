const mongoose = require("mongoose");

const preguntaSchema = new mongoose.Schema({

    cursoId:{
        type:String,
        required:true
    },

    pregunta:{
        type:String,
        required:true
    },

    opcionA:{
        type:String,
        required:true
    },

    opcionB:{
        type:String,
        required:true
    },

    opcionC:{
        type:String,
        required:true
    },

    correcta:{
        type:String,
        required:true
    }

});

module.exports =
mongoose.model(
    "Pregunta",
    preguntaSchema
);