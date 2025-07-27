require('dotenv').config({
    path:'.env'
});

const express = require("express");
const app = express();
const db = require("../src/mongo/db")
const mongoose = require("mongoose")
const cardapioController = require("../src/controllers/cardapio/cardapioController");
const cardapioModel = require("../src/models/Cardapio");
const request = require("supertest");
const memoryServer = require("mongodb-memory-server");
const cardapioService = require("../src/services/cardapio/cardapioService");
const refeicaoModel = require("../src/models/Refeicao");
const validar = require("../src/infra/auth/jwt_service").validar
var server;
let cardapioId;
jest.mock("../src/infra/auth/jwt_service", () => ({
    validar: jest.fn((...roles) => (req, resp, next) => next()),
}))


app.use(express.json());
app.use("/cardapio", cardapioController);

test("retorna true", ()=>{
    expect(true).toEqual(true);
})

var cardapio1 = {
    dia: new Date(new Date(Date.now()).toISOString().split("T")[0]),
    almoco: [],
    cafe: [],
    lanche: [],
    jantar: []
};
var operacoes;
const refsCard1 = [
    {
        tipo_refeicao: "jantar",
        comida: "Sopa de legumes com carne",
        bebida: "NA"
    },
    {
        tipo_refeicao: "jantar",
        comida: "Salada Caesar com frango",
        bebida: "Água com gás e limão"
    },
    {
        tipo_refeicao: "lanche",
        comida: "Sanduíche natural de frango com cream cheese",
        bebida: "Chá gelado"
    },
    {
        tipo_refeicao: "cafe",
        comida: "Pão integral, queijo branco, frutas variadas",
        bebida: "Suco de laranja natural"
    },
    {
        tipo_refeicao: "almoco",
        comida: "Arroz integral, feijão, filé de frango grelhado, salada de folhas",
        bebida: "Água aromatizada com limão"
    },
    {
        tipo_refeicao: "almoco",
        comida: "Arroz integral, lentilha, berinjela assada, salada de grão-de-bico",
        bebida: "Suco de uva integral"
    }
]

beforeAll(async () => {
    server = await memoryServer.MongoMemoryServer.create();
    await db(server.getUri());
    cardapio1 = await cardapioService.createCardapio(new Date(new Date(Date.now()).toISOString().split("T")[0]), refsCard1);
    cardapioId = cardapio1._id;
    operacoes = {
        add: [
            {
                tipo_refeicao: "almoco",
                comida: "Nova comida adicionada",
                bebida: "Nova bebida adicionada"
            }
        ],
        rm: [
            {  
                tipo_refeicao: "almoco",
                comida: "Arroz integral, feijão, filé de frango grelhado, salada de folhas",
                bebida: "Água aromatizada com limão"
            }
        ], 
        upd: [
            {
                _id: cardapio1.almoco[1]._id,
                tipo_refeicao: "lanche",
                comida: "Comida atualizada",
                bebida: "Bebida atualizada"
            }
        ]
    }
});
afterAll(async () => {
    await mongoose.disconnect();
    await server.stop(); 
});

// describe("POST /cardapio/:id_cardapio/operacoes-refeicao", () => {
//     it("Deve realizar operações de adição, remoção e atualização com sucesso", async () => {
//         const response = await request(app)
//             .post(`/cardapio/${cardapioId}/operacoes-refeicao`)
//             .send(operacoes);

//         expect(response.statusCode).toBe(200);
//         expect(response.body.message).toBe("Todas as operações foram realizadas");
//         expect(response.body.cardapio).toBeDefined();
        
//         // Verifica se as operações foram aplicadas corretamente
//         const cardapioAtualizado = await cardapioModel.findById(cardapioId);
//         console.log(cardapioAtualizado);
//         expect(cardapioAtualizado.almoco.length).toBe(2); 
//         expect(cardapioAtualizado.lanche.length).toBe(2); 
//     });

//     it("Deve retornar erro 400 quando nenhuma operação é informada", async () => {
//         const response = await request(app)
//             .post(`/cardapio/${cardapioId}/operacoes-refeicao`)
//             .send({}); 

//         expect(response.statusCode).toBe(400);
//         expect(response.body.message).toBe("Informações requeridas nao informadas");
//     });

//     it("Deve retornar erro 500 quando o cardápio não existe", async () => {
//         const operacoes = {
//             add: [
//                 {
//                     tipo_refeicao: "almoco",
//                     comida: "Nova comida",
//                     bebida: "Nova bebida"
//                 }
//             ]
//         };

//         const idInexistente = new mongoose.Types.ObjectId(); // Gera um ID que não existe

//         const response = await request(app)
//             .post(`/cardapio/${idInexistente}/operacoes-refeicao`)
//             .send(operacoes);

//         expect(response.statusCode).toBe(500);
//         expect(response.body.message).toBe("Ocorreu um erro ao tentar fazer as operações");
//         expect(response.body.erro).toContain("Cardapio não encontrado");
//     });
// });

describe("testa /cardapio/hoje", () => {
    it("Faz um get bem sucedido", async () => {
        const response = await request(app)
            .get("/cardapio/hoje")
            .send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("cardapio");
        console.log(response.body);

        temp = response.body.cardapio
        
        expect(temp.dia).toBe(new Date(new Date(Date.now()).toISOString().split("T")[0]).toISOString());

        expect(temp.almoco.length).toEqual(2);
        for(i = 0; i< temp.almoco; i++) {
            expect(temp.almoco[i]).toMatchObject(cardapio1.almoco[i]);
        }
        expect(temp.jantar.length).toEqual(2);
        for(i = 0; i< temp.jantar; i++) {
            expect(temp.jantar[i]).toMatchObject(cardapio1.jantar[i]);  
        }
        expect(temp.cafe.length).toEqual(1);
        for(i = 0; i< temp.cafe; i++) {
            expect(temp.cafe[i]).toMatchObject(cardapio1.cafe[i]);  
        }
        expect(temp.lanche.length).toEqual(1);
        for(i = 0; i< temp.lanche; i++) {
            expect(temp.lanche[i]).toMatchObject(cardapio1.lanche[i]); 
        }

    }, 10000);

    it("Faz um get mal sucedido - cardapio não existe", async () => {
        await cardapioModel.deleteOne({_id: cardapio1._id});
        const response = await request(app)
            .get("/cardapio/hoje")
            .send();
        expect(response.statusCode).toEqual(500)
        expect(response.body.message).toEqual("Erro ao procurar cardapio");
        expect(response.body.erro).toEqual("Cardapio não encontrado");
    })
})


describe("Post /cardapio/criar", () => {
    it("Consegue criar o cardapio", async() => {
        const resp = await request(app)
            .post("/cardapio/criar")
            .set("Content-type", "application/json")
            .send({data:"1999-01-01", refeicoes: refsCard1})
        
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toHaveProperty("cardapio")

        const resp2 = await request(app)
            .get("/cardapio/1999-01-01")
            .send()
        expect(resp2.body).toHaveProperty("cardapio")

        tempCardEncontrado = resp2.body.cardapio;
        tempCardCriado = resp.body.cardapio;
        
        expect(tempCardCriado.almoco.length).toEqual(2);
        for(i = 0; i< tempCardCriado.almoco; i++) {
            expect(tempCardCriado.almoco[i]).toMatchObject(tempCardEncontrado.almoco[i]);
        }

        expect(tempCardCriado.jantar.length).toEqual(2);
        for(i = 0; i< tempCardCriado.jantar; i++) {
            expect(tempCardCriado.jantar[i]).toMatchObject(tempCardEncontrado.jantar[i]);  
        }

        expect(tempCardCriado.cafe.length).toEqual(1);
        for(i = 0; i< tempCardCriado.cafe; i++) {
            expect(tempCardCriado.cafe[i]).toMatchObject(tempCardEncontrado.cafe[i]);  
        }

        expect(tempCardCriado.lanche.length).toEqual(1);
        for(i = 0; i< tempCardCriado.lanche; i++) {
            expect(tempCardCriado.lanche[i]).toMatchObject(tempCardEncontrado.lanche[i]); 
        }
    }, 10000)

    it("Não consegue criar o cardapio - Informações faltando", async() => {
        const resp = await request(app)
            .post("/cardapio/criar")
            .send({data: Date.now()})
        expect(resp.statusCode).toBe(400);
        expect(resp.body.message).toBe("Informações requeridas não foram enviadas");
    });
})

