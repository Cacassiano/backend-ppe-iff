const router = require('express').Router();
const Aluno =  require('../../services/alunoService');
const jwtService = require("../../infra/auth/jwt_service");

router.post("/register", (req,resp) => {
    console.log(req.body);
    if(req.body.matricula != undefined &&
        req.body.nome != undefined &&
        req.body.sobrenome != undefined &&
        req.body.podeAlmocar != undefined &&
        req.body.senha != undefined
    ) {
        try{
            token = jwtService.criarToken(req.body.matricula,req.body.senha, ["ROLE_ALUNO"]);
            Aluno.save(req.body);
            resp.status(201).json({
                matricula:req.body.matricula, 
                token: token
            });
        } catch (e) {
            console.log(e);
            resp.status(400).json({message: 'erro ao tentar salvar novo aluno'});
        }
    } else {
        resp.status(403).json({message:"erro"});
    }
});


router.post("/login", (req,resp) => {
    if(req.body.matricula != undefined && req.body.senha != undefined) {
        if (Aluno.login(req.body.senha, req.body.matricula)) {
            token = jwtService.criarToken(req.body.matricula,req.body.senha,["ROLE_ALUNO"]);
            resp.status(200).json({
                matricula:req.body.matricula,
                token: token
            });
        } else {
            console.log("error")
            resp.status(400).json({message:"erro"});
            alert("algo deu errado");
        }
    }
});

router.use("/detalhes", jwtService.validar("ROLE_ALUNO"));

router.get("/detalhes", async (req,resp) => {
    aluno = await Aluno.getByMatricula(req.user.id);
    console.log(aluno);
    resp.status(200).json(aluno);
})

module.exports = router;