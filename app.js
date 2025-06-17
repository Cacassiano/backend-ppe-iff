require('dotenv').config({
    path:'.env'
})

const app = require('express')();
const cors = require('cors');
const { urlencoded } = require('express');
const alunoController = require('./src/controllers/alunos/Alunocontroller')
const cantinaController = require('./src/controllers/funcionarios/cantinaController')
const bodyParser = require('body-parser');
const db = require("./src/mongo/db");
const port = 8080;

db();
// Conectar a api a determinada porta
app.listen(port);
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/aluno", alunoController);
app.use("/funcionarios/cantina", cantinaController);

// mapear requisicao tipo GET para o endpoint "/", ou sendo, vazio
app.get("/", (req, resp) => {
    resp.send("test hello world!");
});