const router = require('express').Router();
const service = require('../../services/cardapioService')
const tkservice = require('../../infra/auth/jwt_service')

router.get("/:data", (req,resp) =>{

});

router.get("/:data_inicial/:data_final", (req, resp) => {

});

router.use("*", tkservice.validar("ROLE_FUNC", "ROLE_CANTINA"))
router.post("/criar-cardapio/:data", (req, resp) => {

})
router.post("/add-refeicao/:cardapio_id", (req, resp) => {

})


module.exports = router;