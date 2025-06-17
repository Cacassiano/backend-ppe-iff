const router = require('express').Router();
const Aluno =  require('../../services/alunoService');

router.get("/",(req,res) => res.redirect("/aluno/register"));
router.get("/login", (req,resp) => resp.render("./aluno/templates/login"));
router.get("/homepage", (req,resp) => resp.render("./aluno/templates/homepage"));
router.get("/register", (req, resp) => resp.render("./aluno/templates/register"));

router.post("/register", (req,resp) => {
    if(req.body.matricula != undefined &&
        req.body.nome != undefined &&
        req.body.sobrenome != undefined &&
        req.body.podeAlmocar != undefined &&
        req.body.senha != undefined
    ) {
        Aluno.save(req.body);
        resp.redirect("/aluno/homepage")
    }
});


router.post("/login", (req,resp) => {
    if(req.body.matricula != undefined && req.body.senha != undefined) {
        if (Aluno.login(req.body.senha, req.body.matricula)) {
            console.log("para a homepage");
            resp.redirect("/aluno/homepage")
        } else {
            console.log("error")
            resp.render("./aluno/templates/login");
            alert("algo deu errado");
        }
    }
});
module.exports = router;