const Pregunta = require("./models/Pregunta");
const Leccion = require("./models/Leccion");
const Puntos = require("./models/Puntos");
const PDFDocument = require("pdfkit");
const Progreso = require("./models/Progreso");
const Curso = require("./models/curso");
const Pago = require("./models/Pago");
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const authRoutes = require("./routes/auth");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de autenticación
app.use("/api", authRoutes);

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB conectado");
})
.catch((err) => {
    console.log("❌ Error MongoDB:", err);
});

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../frontend/public")));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/public/index.html")
    );
});

// Rutas de pagos
app.use("/api/pagos", require("./routes/pagos"));

// Obtener usuarios
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

// Obtener pagos
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

// Actualizar pago
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

app.post("/api/preguntas", async (req,res)=>{

    try{

        const pregunta =
        new Pregunta(req.body);

        await pregunta.save();

        res.json({
            mensaje:"Pregunta creada"
        });

    }
    catch(error){

        res.status(500).json({
            mensaje:"Error"
        });

    }

});

app.get("/api/preguntas/:cursoId",
async (req,res)=>{

    try{

        const preguntas =
        await Pregunta.find({

            cursoId:req.params.cursoId

        });

        res.json(preguntas);

    }
    catch(error){

        res.status(500).json({
            mensaje:"Error"
        });

    }

});

// Eliminar curso

app.delete("/api/cursos/:id", async (req, res) => {

    try {

        await Curso.findByIdAndDelete(
            req.params.id
        );

        res.json({
            mensaje: "Curso eliminado"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al eliminar curso"
        });

    }

});


// Guardar progreso

app.post("/api/progreso", async (req, res) => {

    try {

        const progreso =
        await Progreso.findOne({

            usuario: req.body.usuario,
            cursoId: req.body.cursoId

        });

        if(progreso){

            progreso.porcentaje =
            req.body.porcentaje;

            await progreso.save();

        }else{

            const nuevo =
            new Progreso(req.body);

            await nuevo.save();

        }

        res.json({
            mensaje: "Progreso guardado"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al guardar progreso"
        });

    }

});

app.get("/api/progreso/:usuario",
async (req, res) => {

    try {

        const progreso =
        await Progreso.find({
            usuario: req.params.usuario
        });

        res.json(progreso);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener progreso"
        });

    }

});


// Generar certificado PDF
app.get("/api/certificado/:usuario/:curso", (req, res) => {

    try {

        const doc = new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=certificado.pdf`
        );

        doc.pipe(res);

        doc.fontSize(26)
           .text(
             "CERTIFICADO DE FINALIZACION",
             {
               align: "center"
             }
           );

        doc.moveDown();

        doc.fontSize(16)
           .text(
             "Se otorga el presente certificado a:",
             {
               align: "center"
             }
           );

        doc.moveDown();

        doc.fontSize(22)
           .text(
             req.params.usuario,
             {
               align: "center"
             }
           );

        doc.moveDown();

        doc.fontSize(16)
           .text(
             "Por haber completado satisfactoriamente el curso:",
             {
               align: "center"
             }
           );

        doc.moveDown();

        doc.fontSize(20)
           .text(
             req.params.curso,
             {
               align: "center"
             }
           );

        doc.moveDown(2);

        doc.fontSize(16)
           .text(
             "MUNDO ENGLISH V4",
             {
               align: "center"
             }
           );

        doc.end();

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al generar certificado"
        });

    }

});

app.post("/api/puntos", async (req, res) => {

    try {

        let registro = await Puntos.findOne({
            usuario: req.body.usuario
        });

        if (!registro) {

            registro = new Puntos({
                usuario: req.body.usuario,
                puntos: req.body.puntos
            });

        } else {

            registro.puntos += req.body.puntos;

        }

        await registro.save();

        res.json({
            mensaje: "Puntos actualizados",
            puntos: registro.puntos
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al guardar puntos"
        });

    }

});

app.get("/api/puntos/:usuario", async (req, res) => {

    try {

        const registro = await Puntos.findOne({
            usuario: req.params.usuario
        });

        if (!registro) {

            return res.json({
                puntos: 0
            });

        }

        res.json(registro);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error"
        });

    }

});

// Ranking de alumnos

app.get("/api/ranking", async (req, res) => {

    try {

        const ranking =
        await Puntos.find()
        .sort({ puntos: -1 })
        .limit(10);

        res.json(ranking);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener ranking"
        });

    }

});

app.post("/api/lecciones", async (req, res) => {

    try {

        const nuevaLeccion =
        new Leccion(req.body);

        await nuevaLeccion.save();

        res.json({
            mensaje: "Lección creada"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al crear lección"
        });

    }

});

app.get("/api/lecciones/:cursoId", async (req, res) => {

    try {

        const lecciones =
        await Leccion.find({

            cursoId: req.params.cursoId

        }).sort({
            orden: 1
        });

        res.json(lecciones);

    } catch (error) {

        console.log(error);

    res.status(500).json({
        mensaje: "Error al obtener lecciones"
    });

}

});

// Eliminar usuario
app.delete("/api/usuarios/:id", async (req, res) => {

    try {

        await User.findByIdAndDelete(
            req.params.id
        );

        res.json({
            mensaje: "Usuario eliminado"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al eliminar usuario"
        });

    }

});

// Obtener curso por ID
app.get("/api/cursos/:id", async (req, res) => {

    try {

        const curso =
        await Curso.findById(
            req.params.id
        );

        res.json(curso);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener curso"
        });

    }

});

// Iniciar servidor
app.listen(process.env.PORT || 3000, () => {

    console.log(
        `🚀 Servidor iniciado en puerto ${process.env.PORT || 3000}`
    );

});

