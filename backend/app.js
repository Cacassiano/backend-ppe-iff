require('dotenv').config({
    path:'.env'
});

const express = require('express');
const app = express();
const cors = require('cors');
const { urlencoded } = require('express');
const alunoController = require('./src/controllers/alunos/Alunocontroller');
const cantinaController = require('./src/controllers/funcionarios/cantinaController');
const cardapioController = require("./src/controllers/cardapio/cardapioController");
const tkservice = require('./src/infra/auth/jwt_service');
const bodyParser = require('body-parser');
const db = require("./src/mongo/db");
const port = 8080;

(async () => {
    await db(); // conecta ao Mongo antes de tudo

    // Middlewares e rotas
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.json());

    app.use("/aluno", alunoController);
    app.use("/funcionarios/cantina", cantinaController);
    app.use("/cardapio", tkservice.validar("ROLE_ALUNO"));
    app.use("/cardapio", cardapioController);

    app.get("/", (req, resp) => {
        resp.send("test hello world!");
    });

    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
})();

