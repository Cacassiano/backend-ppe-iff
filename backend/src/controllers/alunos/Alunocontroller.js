const router = require('express').Router();
const Aluno =  require('../../services/usuarios/alunoService');
const jwtService = require("../../infra/auth/jwt_service");

router.post("/register", async (req,resp) => {
    if(!req.body.matricula || !req.body.nome || !req.body.sobrenome || !req.body.podeAlmocar || !req.body.senha) {
        return resp.status(400).json({message:"Informações faltando na requisição"});
    }

    senha = req.body.senha;
    req.body.podeAlmocar = (req.body.podeAlmocar == "sim") ? true : false;
    try{
        aluno = await Aluno.save(req.body);
        token = jwtService.criarToken(req.body.matricula, aluno.id, senha);
        return resp.status(201).json({
                matricula:req.body.matricula, 
                token: token
            });
    } catch (e) {
        if (e.code == 11000) {
            console.error("MATRICULA JA REGISTRADA") // isso sera tratado no script
            return resp.status(409).json({ message: "Matrícula já cadastrada" });
        }
        console.error("erro ao tentar criar novo aluno: "+ e.message);
        return resp.status(404).json({message: e.message});
    }
});


router.post("/login", async (req,resp) => {
    if(!req.body.matricula || !req.body.senha) return resp.status(400).json({message: "Informações requeridas não foram enviadas"});
    try{
        aluno = await Aluno.login(req.body.senha, req.body.matricula);
        token = jwtService.criarToken(req.body.matricula ,aluno.id, req.body.senha);
        return resp.status(200).json({
            matricula:req.body.matricula,
            token: token
        });
    } catch(e) {
        return resp.status(404).json({message: e.message});
    }
});

router.use("/detalhes", jwtService.validar("ROLE_ALUNO"));
router.get("/detalhes", async (req,resp) => {
    try {
        aluno = await Aluno.getById(req.user.id);
        return resp.status(200).json(aluno);
    } catch(e) {
        return resp.status(404).json({message: e.message});
    }
})

module.exports = router;