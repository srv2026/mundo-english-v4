const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    const existe = await User.findOne({ correo });

    if (existe) {
      return res.json({
        mensaje: "El usuario ya existe"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({
      nombre,
      correo,
      password: hash
    });

    await nuevoUsuario.save();

    res.json({
      mensaje: "Usuario registrado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      mensaje: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {

    const { correo, password } = req.body;

    const usuario = await User.findOne({
      correo
    });

    if (!usuario) {
      return res.json({
        mensaje: "Usuario no encontrado"
      });
    }

    const valido = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!valido) {
      return res.json({
        mensaje: "Contraseña incorrecta"
      });
    }

    res.json({
  success: true,
  mensaje: "Bienvenido " + usuario.nombre,
  usuario: usuario.nombre,
  rol: usuario.rol
});

  } catch (error) {

    res.status(500).json({
      mensaje: error.message
    });

  }
});

module.exports = router;