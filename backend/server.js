const Curso = require("./models/curso");
const Pago = require("./models/Pago");
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


app.post("/api/register", async (req,res)=>{

    try {

        const { nombre, correo, password } = req.body;

        const nuevoUsuario = new User({
            nombre,
            correo,
            password
        });

        await nuevoUsuario.save();

        res.json({
            mensaje: "Usuario registrado correctamente"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al registrar"
        });

    }

});

app.post("/api/login", async (req,res)=>{

try{
console.log("Datos recibidos:", req.body);  

const usuario = await User.findOne({
   correo: req.body.correo
});

if(!usuario){

return res.json({
mensaje:"Usuario no encontrado"
});

}

if(usuario.password !== req.body.password){

return res.json({
mensaje:"Contraseña incorrecta"
});

}

res.json({
success: true,
mensaje: "Bienvenido " + usuario.nombre,
usuario: usuario.nombre
});


}
catch(error){

console.log(error);

res.json({
mensaje:"Error al iniciar sesión"
});

}

});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB conectado");
})
.catch((err) => {
    console.log("❌ Error MongoDB:", err);
});

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/api/pagos", require("./routes/pagos"));

app.get("/api/usuarios", async (req, res) => {

    try {

        const usuarios = await User.find();

        res.json(usuarios);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener usuarios"
        });

    }

});


app.get("/api/pagos", async (req, res) => {

    try {

        const pagos = await Pago.find();

        res.json(pagos);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener pagos"
        });

    }

});

app.put("/api/pagos/:id", async (req, res) => {

  try {

    await Pago.findByIdAndUpdate(
      req.params.id,
      {
        estado: req.body.estado
      }
    );

    res.json({
      mensaje: "Estado actualizado"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      mensaje: "Error al actualizar"
    });

  }

});

// Obtener cursos

app.get("/api/cursos", async (req, res) => {

    try {

        const cursos = await Curso.find();

        res.json(cursos);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener cursos"
        });

    }

});

// Crear curso

app.post("/api/cursos", async (req, res) => {

    try {

        const nuevoCurso = new Curso(req.body);

        await nuevoCurso.save();

        res.json({
            mensaje: "Curso creado"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al crear curso"
        });

    }

});

app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado en puerto ${process.env.PORT}`);
});
