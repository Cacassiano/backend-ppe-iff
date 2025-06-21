const Funcionario = require('../../services/funcionarioServices');
const router = require('express').Router();
const tkservice = require('../../infra/auth/jwt_service');

router.post("/login", (req,resp) => {
    if(req.body.email != undefined && req.body.senha != undefined) {
        if (Funcionario.login(req.body.senha, req.body.email)) {
            token = tkservice.criarToken(req.body.email, req.body.senha, ["ROLE_ALUNO","ROLE_FUNC", "ROLE_CANTINA"]);
            resp.status(200).json({
                token: token,
                email: req.body.email
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
        token = tkservice.criarToken(req.body.email, req.body.senha, ["ROLE_ALUNO", "ROLE_FUNC", "ROLE_CANTINA"]);
        Funcionario.save(req.body);
        resp.status(201).json({
            token: token,
            email: req.body.email
        })
    }else {
        resp.status(400).json({message: "requisicao invalida, campos faltando"});
    }
});

router.use("/detalhes", tkservice.validar("ROLE_FUNC", "ROLE_CANTINA"));
router.get("/detalhes", async (req,resp) => {
    func = await Funcionario.getByEmail(req.user.id);
    console.log(func);
    return resp.status(200).json(func);
})

module.exports = router;