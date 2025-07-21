const router = require('express').Router();
const service = require('../../services/cardapio/cardapioService')
const tkservice = require('../../infra/auth/jwt_service')

router.get("/hoje", async (req,resp) =>{
    let cardapio;
    try{
        cardapio = await service.getCardapioByData(new Date(Date.now()));
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

//  a ser desenvolvido
// router.get("/:data_inicial/:data_final", (req, resp) => {
//     resp.send("Em producao")
// });


router.use("/criar", tkservice.validar("ROLE_FUNC", "ROLE_CANTINA"))
router.post("/criar", async(req, resp) => {
    console.log(req.body);
    if(!req.body.data || !req.body.refeicoes) return resp.status(400).json({message: "Informações requeridas não foram enviadas"});
    try{
        cardapio = await service.createCardapio(new Date(req.body.data), req.body.refeicoes);
        return resp.status(201).json({
            cardapio:cardapio
        });
    } catch(e) {
        return resp.status(500).json({
            message: "Erro ao tentar criar cardapio",
            erro: e.message
        });
    }
})


router.post("/:id_cardapio/operacoes-refeicao", async (req, resp) => {
    if(!req.body.add && !req.body.rm && !req.body.upd) return resp.status(400).json({message: "Informações requeridas nao informadas"});
    try{
        new_cardapio = await service.refeicao_ops(req.body, req.params.id_cardapio);
        return resp.status(200).json({
            message: "Todas as operações foram realizadas",
            cardapio: new_cardapio
        })
    } catch(e) {
        return resp.status(500).json({
            message: "Ocorreu um erro ao tentar fazer as operações", 
            erro: e.message
        });
    }
})
module.exports = router;