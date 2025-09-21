require('dotenv').config({
    path:'.env'
});

const express = require("express");
const app = express();
const db = require("../src/mongo/db")
const mongoose = require("mongoose")
const alunoController = require("../src/controllers/alunos/Alunocontroller");
const alunoModel = require("../src/models/Aluno");
// const tkService = require("../src/infra/auth/jwt_service");
const request = require("supertest");
const bcript = require("../src/infra/auth/criptografiaService");
const memoryServer = require("mongodb-memory-server");
var server;

app.use(express.json());
app.use("/aluno", alunoController);

const alunoTeste = {
    podeAlmocar: false,
    nome: "testador",
    sobrenome: "da Silva",
    matricula :"663,56416414654885,1165463666666", 
    senha: "testadorSenha",
    roles: ["ROLE_USER", "ROLE_ALUNO"]
}
const alunoTesteCriar = {
    podeAlmocar: "sim",
    nome: "testador2",
    sobrenome: "da Silva",
    matricula :"663,4444,1165463666666", 
    senha:"testesenha"
}

beforeAll(async () => {
    server = await memoryServer.MongoMemoryServer.create();
    await db(server.getUri());
    nSenha = bcript.criptografar(alunoTeste.senha);
    temp = {...alunoTeste, senha: nSenha};
    await new alunoModel(temp).save();
}, 10000);
afterAll(async () => {
    await mongoose.disconnect();
    await server.stop(); 
});

describe("Post /aluno/register", () => {
    it("Retorna uma criação bem sucedida", async () =>{
        const resp = await request(app)
            .post("/aluno/register")
            .send({...alunoTesteCriar, senha: "hjhfsadkjfhksd"});
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toHaveProperty('token');
        expect(resp.body.matricula).toEqual(alunoTesteCriar.matricula);
    })

    it("Retorna uma criação mal sucedido - informações faltando", async () => {
        const resp = await request(app)
            .post("/aluno/register")
            .send({...alunoTesteCriar, senha: null})
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual("Informações faltando na requisição")
    });

    it("Retorna uma criação mal sucedido - Tentativa de inserir um item duplicado", async () => {
        const resp = await request(app)
            .post("/aluno/register")
            .send({...alunoTeste, podeAlmocar: "nao"})
        expect(resp.statusCode).toEqual(409);
        expect(resp.body.message).toEqual("Matrícula já cadastrada");
    });
})

describe("Post /aluno/login", () => {
    it("Retorna um login bem sucedido", async () => {
        const resp = await request(app)
            .post("/aluno/login")
            .send({matricula: alunoTeste.matricula, senha: alunoTeste.senha});
        expect(resp.statusCode).toEqual(200);
        expect(resp.body).toHaveProperty('token');
        expect(resp.body.matricula).toEqual(alunoTeste.matricula);
    });

    it("Retorna um login mal sucedido - senha errada", async () => {
        const resp = await request(app)
            .post("/aluno/login")
            .send({matricula: alunoTeste.matricula, senha: alunoTeste.senha+"senha"});
        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toHaveProperty('message');
        expect(resp.body.message).toEqual("Senha incorreta");
    });

    it("Retorna um login mal sucedido - Request Incompleta", async () => {
        const resp = await request(app)
            .post("/aluno/login")
            .send({matricula :alunoTeste.matricula});
        expect(resp.statusCode).toEqual(400);
        expect(resp.body).toHaveProperty('message');
        expect(resp.body.message).toEqual("Informações requeridas não foram enviadas");
    });

    it("Retorna um login mal sucedido - Usuário não existe", async () => {
        const resp = await request(app)
            .post("/aluno/login")
            .send({matricula :"-"+alunoTeste.matricula, senha: alunoTeste.senha});
        expect(resp.statusCode).toEqual(404);
        expect(resp.body).toHaveProperty('message');
        expect(resp.body.message).toMatch("Não foi possível encontrar");
    });
});
