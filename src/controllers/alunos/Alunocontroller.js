const router = require('express').Router();
const Aluno =  require('../../services/alunoService');
const jwtService = require("../../infra/auth/jwt_service");

router.post("/register", async (req,resp) => {
    console.log(req.body);
    if(req.body.matricula != undefined &&
        req.body.nome != undefined &&
        req.body.sobrenome != undefined &&
        req.body.podeAlmocar != undefined &&
        req.body.senha != undefined
    ) {
        senha = req.body.senha;
        aluno = await Aluno.save(req.body);
        if(aluno == null) {
            console.log("erro te peguei");
            return resp.status(500).json({mssage: "erro ao criar novo usuario"});
        } else {
            token = jwtService.criarToken(req.body.matricula, aluno.id, senha);
            resp.status(201).json({
                matricula:req.body.matricula, 
                token: token
            });
        }
    } else {
        resp.status(403).json({message:"erro"});
    }
});


router.post("/login", async (req,resp) => {
    if(req.body.matricula != undefined && req.body.senha != undefined) {
        aluno = await Aluno.login(req.body.senha, req.body.matricula);
        if (aluno !== null) {
            token = jwtService.criarToken(req.body.matricula ,aluno.id, req.body.senha);
            resp.status(200).json({
                matricula:req.body.matricula,
                token: token
            });
        } else {
            console.log("error")
            resp.status(400).json({message:"user não existe"});
        }
    }
});

router.use("/detalhes", jwtService.validar("ROLE_ALUNO"));

router.get("/detalhes", async (req,resp) => {
    aluno = await Aluno.getById(req.user.id);
    console.log(aluno);
    resp.status(200).json(aluno);
})

module.exports = router;