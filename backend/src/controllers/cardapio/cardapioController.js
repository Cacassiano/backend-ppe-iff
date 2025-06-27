const router = require('express').Router();
const service = require('../../services/cardapio/cardapioService')
const tkservice = require('../../infra/auth/jwt_service')

router.get("/:data", (req,resp) =>{
    resp.send("Em producao")
});

router.get("/:data_inicial/:data_final", (req, resp) => {
    resp.send("Em producao")
});

router.use("/*", tkservice.validar("ROLE_FUNC", "ROLE_CANTINA"))
router.post("/criar-cardapio/:data", (req, resp) => {
    resp.send("Em producao")
})
router.post("/add-refeicao/:cardapio_id", (req, resp) => {
    resp.send("Em producao")
})


module.exports = router;