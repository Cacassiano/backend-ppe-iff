const Funcionario = require('../../services/funcionarioServices');
const router = require('express').Router();
const tkservice = require('../../infra/auth/jwt_service');

router.post("/login", (req,resp) => {
    if(req.body.email != undefined && req.body.senha != undefined) {
        if (Funcionario.login(req.body.senha, req.body.email)) {
            token = tkservice.criarToken(req.body.email, req.body.senha);
            resp.status(200).json({
                token: token,
                email: email
            })
        } else {
            resp.status(403).json({message: "erro login"});
        }
    } else {
        resp.status(400).json({message: "erro login"});
    }
});


router.post("/register", (req,resp) => {
    if(req.body.email != undefined &&
        req.body.nome != undefined &&
        req.body.sobrenome != undefined &&
        req.body.senha != undefined
    ) {
        token = tkservice.criarToken(req.body.email, req.body.senha, ["ROLE_FUNC"]);
        Funcionario.save(req.body);
        resp.status(201).json({
            token: token,
            email: req.body.email
        })
    }else {
        resp.status(400).json({message: "requisicao invalida, campos faltando"});
    }
});

router.use("/detalhes", tkservice.validarFuncionario);
router.get("/detalhes", async (req,resp) => {
    tkContent = tkservice.getConteudo(req);
    func = await Funcionario.getByEmail(tkContent.id);
    console.log(func);
    return resp.status(200).json(func);
})

module.exports = router;