require('dotenv').config({
    path: '.env'
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const memoryServer = require("mongodb-memory-server");
const db = require("./src/mongo/db");

const AlunoController = require('./src/controllers/Alunocontroller');
const ServidorController = require('./src/controllers/ServidorController');
const CardapioController = require("./src/controllers/cardapioController");
const JwtService = require('./src/infra/auth/JWTService');

const RefeicaoService = require('./src/services/RefeicaoService');
const AlunoService = require('./src/services/alunoService');
const CardapioService = require('./src/services/cardapioService');
const ServidorService = require('./src/services/ServidorService');

const BcriptService = require('./src/infra/auth/BcriptService');

let bancoURI = process.env.DB_URL;
const port = 8080;

class App {
    constructor(
        AlunoController,
        ServidorController,
        CardapioController,
        JwtService
    ) {
        this.app = express();
        this.AlunoController = AlunoController;
        this.ServidorController = ServidorController;
        this.CardapioController = CardapioController;
        this.JwtService = JwtService;
        this.configurarMiddlewares();
        this.configurarRotas();
    }

   configurarMiddlewares() {
    // Origens permitidas (adiciona localhost pra dev)
        const allowedOrigins = [
            'https://frontend-ppe-iff.vercel.app',
            'http://localhost:3000'
        ];

        const corsOptions = {
            origin: (origin, callback) => {
                // origin === undefined acontece em requests via curl / Postman (não-browsers)
                if (!origin) return callback(null, true);
                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                } else {
                    return callback(new Error('CORS policy: origin not allowed'), false);
                }
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'], // clean e funcional

            exposedHeaders: ['Authorization'], // se você expõe token no header
            credentials: true, // IMPORTANTÍSSIMO se o front mandar cookies ou usar credentials
            maxAge: 600 // cache da preflight por 10 minutos
        };

        // Use CORS com as opções definidas
        this.app.use(cors(corsOptions));

        // responde preflight apenas para rotas que realmente existem
        this.app.options(['/alunos', '/funcionarios', '/cardapios'], cors(corsOptions));


        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.json());
    }


    configurarRotas() {
        this.app.use("/alunos", this.AlunoController.router);
        this.app.use("/servidores", this.ServidorController.router);
        this.app.use(
            "/cardapios", 
            this.JwtService.validar("ROLE_USER"), 
            this.CardapioController.router
        );

        this.app.get("/", (req, resp) => {
            resp.send("test hello world!");
        });
    }

    listen(port) {
        this.app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    }
}

(async () => {

    // conecta com o DB
    await db(bancoURI);

    // Injeção de dependencias
    const bcriptService = new BcriptService();
    const alunoService = new AlunoService(bcriptService);
    const refeicaoService = new RefeicaoService();
    const cardapioService = new CardapioService(refeicaoService);
    const servidorService = new ServidorService(bcriptService);

    const jwtService = new JwtService(alunoService, servidorService, bcriptService);

    const alunoController = new AlunoController(alunoService, jwtService);
    const servidorController = new ServidorController(servidorService, jwtService);
    const cardapioController = new CardapioController(cardapioService, refeicaoService, jwtService);

    const appInstance = new App(
        alunoController,
        servidorController,
        cardapioController,
        jwtService
    );

    appInstance.listen(port);
})();

module.exports = App;
