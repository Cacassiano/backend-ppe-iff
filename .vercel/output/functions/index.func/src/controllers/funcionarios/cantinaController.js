const Funcionario = require('../../services/usuarios/funcionarioServices');
const router = require('express').Router();
const tkservice = require('../../infra/auth/jwt_service');

router.post("/login", async (req,resp) => {
    if(!req.body.email || !req.body.senha) resp.status(400).json({message: "Informações faltando na requisição"});
    try{
        func = await Funcionario.login(req.body.senha, req.body.email)
        token = tkservice.criarToken(req.body.email, func.id, req.body.senha);
        resp.status(200).json({
            token: token,
            email: req.body.email
        })
    } catch(e) {
        return resp.status(404).json({message: e.message});
    }
});


router.post("/register", async (req,resp) => {
    if(!req.body.email ||
        !req.body.nome ||
        !req.body.sobrenome ||
        !req.body.senha
    ) resp.status(400).json({message: "Informações faltando na requisição"});
        try{
            senha = req.body.senha;
            func = await Funcionario.save(req.body, ["ROLE_CANTINA"]);
            token = tkservice.criarToken(req.body.email, func.id, senha);
            resp.status(201).json({
                token: token,
                email: req.body.email
            })
        } catch(e) {
            if (e.code == 11000) {
                console.error("MATRICULA JA REGISTRADA") // isso sera tratado no script
                return resp.status(409).json({ message: "Email já cadastrado" });
            }
            return resp.status(500).json({message: e.message});
        }  
});

router.use("/detalhes", tkservice.validar("ROLE_FUNC", "ROLE_CANTINA"));
router.get("/detalhes", async (req,resp) => {
    func = await Funcionario.getById(req.user.id);
    console.log(func);
    return resp.status(200).json(func);
})

module.exports = router;