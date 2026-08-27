const mongoose = require("mongoose");

const PagoSchema = new mongoose.Schema({
  nombreArchivo: String,
  estado: {
    type: String,
    default: "Pendiente"
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pago", PagoSchema);