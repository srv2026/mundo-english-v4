const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({

    destination: "uploads/comprobantes",

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + "-" + file.originalname
        );

    }

});

const Pago = require("../models/Pago");

const upload = multer({ storage });

router.post(
  "/comprobante",
  upload.single("file"),
  async (req, res) => {

    try {

      const pago = new Pago({
        nombreArchivo: req.file.filename
      });

      await pago.save();

      res.json({
        mensaje: "Comprobante recibido correctamente"
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        mensaje: "Error al guardar pago"
      });

    }

  }
);

module.exports = router;