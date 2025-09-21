const router = require('express').Router();
const service = require('../../services/cardapio/cardapioService')
const tkservice = require('../../infra/auth/jwt_service')

/* 
    Request:
    get: http:// localhost:8080/hoje -> para o cardapio do dia,
    get: http:// localhost:8080/qualquerData(Integer/ String) -> para o cardapio do dia pedido,
*/
router.get("/:dia", async (req,resp) =>{
    let cardapio;
    try{
        if(Number.isInteger(req.params.dia)) req.params.dia = req.params.dia-0;
        cardapio = await service.getCardapioByData(new Date(req.params.dia == "hoje" ? Date.now(): req.params.dia));
        return resp.status(200).json({
            cardapio: cardapio
        });
    } catch(e) {
        return resp.status(500).json({
            message: "Erro ao procurar cardapio",
            erro: e.message
        });
    }
});
/*
    Response:
    cardapio: {
        dia: dia,
        almoco: [...],
        jantar: [...],
        cafe: [...],
        lanche: [...],
    }
*/

// Create cardapio
/*
    REQUEST: 

    (obrigatorio)data: Inteiro/String,
    (opcional)refeicoes: [
        {
            tipo_refeicao: String,
            comida: String,
            bebida: String
        },
        {
            tipo_refeicao: String,
            comida: String,
            bebida: String
        }...
    ]
*/
router.use("/criar", tkservice.validar("ROLE_FUNC", "ROLE_CANTINA"))
router.post("/criar", async(req, resp) => {
    if(!req.body || !req.body.data) return resp.status(400).json({message: "Informações requeridas não foram enviadas"});
    try{
        if(Number.isInteger(req.body.data)) req.body.data = req.body.data-0;
        cardapio = await service.createCardapio(new Date(req.body.data).toISOString().split("T")[0], req.body.refeicoes);
        return resp.status(201).json({
            cardapio:cardapio
        });
    } catch(e) {
        console.error("criar cardapio falhou: " + e);
        return resp.status(500).json({
            message: "Erro ao tentar criar cardapio",
            erro: e.message
        });
    }
})
/*
    RESPONSE:
    cardapio = {
        dia: dia,
        almoco: [...],
        jantar: [...],
        cafe: [...],
        lanche: [...],
    };

*/

// Update refs
/*
    REQUEST:
    upd: [
        {
            _id: String,
            tipo_refeicao: String,
            comida: String,
            bebida: String
        }
        ...
    ],
    rm:  [
        {
            tipo_refeicao: String,
            comida: String,
            bebida: String
        }
        ...
    ],
    add: [
        {
            tipo_refeicao: String,
            comida: String,
            bebida: String
        }
        ...
    ]
*/
router.post("/:id_cardapio/operacoes-refeicao", async (req, resp) => {
    if((!req.body.add && !req.body.rm && !req.body.upd) || !req.params.id_cardapio) return resp.status(400).json({message: "Informações requeridas nao informadas"});
    try{
        new_cardapio = await service.refeicao_ops(req.body, req.params.id_cardapio);
        return resp.status(200).json({
            message: "Todas as operações foram realizadas",
            cardapio: new_cardapio
        })
    } catch(e) {
        console.error(e);
        return resp.status(500).json({
            message: "Ocorreu um erro ao tentar fazer as operações", 
            erro: e.message
        });
    }
})
/*
    RESPONSE:
    cardapio: {
        dia: dia,
        almoco: [...],
        jantar: [...],
        cafe: [...],
        lanche: [...],
    }

*/
module.exports = router;