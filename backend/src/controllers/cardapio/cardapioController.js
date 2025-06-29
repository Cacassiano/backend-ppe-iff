const router = require('express').Router();
const service = require('../../services/cardapio/cardapioService')
const tkservice = require('../../infra/auth/jwt_service')
router.use("/hoje",tkservice.validar("ROLE_ALUNO"))
router.get("/hoje", async (req,resp) =>{
    let cardapio;
    try{
        cardapio = await service.getCardapioByData(new Date(Date.now()));
    } catch(e) {
        return resp.status(500).json({
            message: "Erro ao procurar cardapio",
            erro: e.message
        });
    }
    return resp.status(200).json({
        cardapio: cardapio
    });
    
});

router.use("/:data_inicial/:data_final",tkservice.validar("ROLE_ALUNO"))
router.get("/:data_inicial/:data_final", (req, resp) => {
    resp.send("Em producao")
});


router.use("/criar", tkservice.validar("ROLE_FUNC", "ROLE_CANTINA"))
router.post("/criar", async(req, resp) => {
    console.log(req.body);
    if(req.body.data !== undefined || req.body.refeicoes !== undefined || req.body.refeicoes !== null ) {
        try{
            cardapio = await service.createCardapio(new Date(req.body.data), req.body.refeicoes);
            return resp.status(201).json({
                cardapio:cardapio
            });
        } catch(e) {
            return resp.status(500).json({
                message: "Erro ao tentar criar cardapio",
                erro: e
            })
        }
    } else {
        return resp.status(400).json({
            message: "Informações requeridas não forama enviadas"
        })
    }
})
router.post("/add-refeicao/:cardapio_id", (req, resp) => {
    resp.send("Em producao")
})


module.exports = router;