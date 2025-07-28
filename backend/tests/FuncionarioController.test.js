require('dotenv').config({
    path:'.env'
});

const express = require("express");
const app = express();
const db = require("../src/mongo/db")
const funcionarioController = require("../src/controllers/funcionarios/cantinaController");
const funcionarioModel = require("../src/models/Funcionario");
const mongoose = require("mongoose");
const tkService = require("../src/infra/auth/jwt_service");
const request = require("supertest");
const bcript = require("../src/infra/auth/criptografiaService");
const memoryServer = require("mongodb-memory-server");
var server;

app.use(express.json());
app.use("/funcionarios/cantina", funcionarioController);

var funcionarioTeste = {
    nome: "Funcionario",
    sobrenome: "da Cantina",
    email: "funcionario@cantina.com", 
    senha: "funcionarioSenha",
    roles: ["ROLE_USER", "ROLE_FUNC", "ROLE_CANTINA"]
}

var funcionarioTesteCriar = {
    nome: "Novo Funcionario",
    sobrenome: "da Silva",
    email: "novo.funcionario@cantina.com", 
    senha: "novaSenha123"
}
beforeAll(async () => {
    server = await memoryServer.MongoMemoryServer.create();
    await db(server.getUri());
    nSenha = bcript.criptografar(funcionarioTeste.senha);
    temp = {...funcionarioTeste, senha: nSenha};
    await new funcionarioModel(temp).save();
}, 10000);

afterAll(async () => {
    await mongoose.disconnect();
    await server.stop(); 
});

describe("Post /funcionarios/cantina/register", () => {
    it("Retorna uma criação bem sucedida", async () =>{
        const resp = await request(app)
            .post("/funcionarios/cantina/register")
            .send(funcionarioTesteCriar);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toHaveProperty('token');
        expect(resp.body.email).toEqual(funcionarioTesteCriar.email);
    })

    it("Retorna uma criação mal sucedida - informações faltando", async () => {
        const resp = await request(app)
            .post("/funcionarios/cantina/register")
            .send({...funcionarioTesteCriar, sobrenome: null})
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual("Informações faltando na requisição")
    });

    it("Retorna uma criação mal sucedida - Tentativa de inserir um item duplicado", async () => {
        const resp = await request(app)
            .post("/funcionarios/cantina/register")
            .send({...funcionarioTeste, nome: "Outro Nome"})
        expect(resp.statusCode).toEqual(409);
        expect(resp.body.message).toEqual("Email já cadastrado");
    });
})

describe("Post /funcionarios/cantina/login", () => {
    it("Retorna um login bem sucedido", async () => {
        const resp = await request(app)
            .post("/funcionarios/cantina/login")
            .send({email: funcionarioTeste.email, senha: funcionarioTeste.senha});
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toHaveProperty('token');
        expect(resp.body.email).toEqual(funcionarioTeste.email);
    });

    it("Retorna um login mal sucedido - senha errada", async () => {
        const resp = await request(app)
            .post("/funcionarios/cantina/login")
            .send({email: funcionarioTeste.email, senha: funcionarioTeste.senha+"senha"});
        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toHaveProperty('message');
        expect(resp.body.message).toEqual("Senha incorreta");
    });

    it("Retorna um login mal sucedido - Request Incompleta", async () => {
        const resp = await request(app)
            .post("/funcionarios/cantina/login")
            .send({email: funcionarioTeste.email});
        expect(resp.statusCode).toEqual(400);
        expect(resp.body).toHaveProperty('message');
        expect(resp.body.message).toEqual("Informações faltando na requisição");
    });

    it("Retorna um login mal sucedido - Usuário não existe", async () => {
        const resp = await request(app)
            .post("/funcionarios/cantina/login")
            .send({email: "naoexiste@"+funcionarioTeste.email, senha: funcionarioTeste.senha});
        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toHaveProperty('message');
        expect(resp.body.message).toMatch("Não foi possível encontrar");
    });
});