const mongoose = require("mongoose");

const puntosSchema = new mongoose.Schema({

    usuario:{
        type:String,
        required:true
    },

    puntos:{
        type:Number,
        default:0
    }

});

module.exports = mongoose.model(
    "Puntos",
    puntosSchema
);