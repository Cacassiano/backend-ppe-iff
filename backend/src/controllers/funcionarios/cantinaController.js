const Funcionario = require('../../services/usuarios/funcionarioServices');
const router = require('express').Router();
const tkservice = require('../../infra/auth/jwt_service');

router.post("/login", async (req,resp) => {
    if(req.body.email != undefined && req.body.senha != undefined) {
        func = await Funcionario.login(req.body.senha, req.body.email)
        console.log(func)
        if (func) {
            token = tkservice.criarToken(req.body.email, func.id, req.body.senha);
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


router.post("/register", async (req,resp) => {
    if(req.body.email != undefined &&
        req.body.nome != undefined &&
        req.body.sobrenome != undefined &&
        req.body.senha != undefined
    ) {
        senha = req.body.senha;
        func = await Funcionario.save(req.body, ["ROLE_CANTINA"]);
        if(func == null) {
            return resp.status(500).json({mssage: "erro ao criar novo usuario"});
        }
        token = tkservice.criarToken(req.body.email, func.id, senha);
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
    func = await Funcionario.getById(req.user.id);
    console.log(func);
    return resp.status(200).json(func);
})

module.exports = router;