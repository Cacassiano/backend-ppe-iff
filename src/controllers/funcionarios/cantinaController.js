const Funcionario = require('../../services/funcionarioServices');
const router = require('express').Router();

router.get("/login", (req,resp) => {
    if(req.query.email != undefined && req.query.senha != undefined) {
        if (Funcionario.login(req.query.senha, req.query.email)) {
            resp.redirect("/funcionarios/cantina/homepage")
        } else {
            resp.json({messafe: "erro login"});
        }
    } else {
        resp.json({messafe: "erro login"});
    }
});

router.get("/register", (req,resp) => {
    if(req.query.email != undefined &&
        req.query.nome != undefined &&
        req.query.sobrenome != undefined &&
        req.query.senha != undefined
    ) {
        Funcionario.save(req.query);
        resp.redirect("/funcionarios/cantina/homepage")
    }else {
        resp.render("./cantina/templates/register");
    }
});

router.get("/homepage", (req,resp) => {
    resp.render("./cantina/templates/homepage");
});

module.exports = router;