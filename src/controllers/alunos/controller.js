const router = require('express').Router();
const Aluno =  require('../../services/alunoService');

router.get("/",(req,res) => {
    res.redirect("/aluno/register");
});

router.get("/register", (req,resp) => {
    if(req.query.matricula != undefined &&
        req.query.nome != undefined &&
        req.query.sobrenome != undefined &&
        req.query.podeAlmocar != undefined &&
        req.query.senha != undefined
    ) {
        Aluno.save(req.query);
        resp.redirect("/aluno/homepage")
    }else {
        resp.render("./aluno/templates/register");
    }
});

router.get("/homepage", (req,resp) => {
    resp.render("./aluno/templates/homepage");
});

module.exports = router;