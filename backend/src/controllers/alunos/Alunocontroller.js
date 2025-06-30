const router = require('express').Router();
const Aluno =  require('../../services/usuarios/alunoService');
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
        try{
            aluno = await Aluno.save(req.body);
            token = jwtService.criarToken(req.body.matricula, aluno.id, senha);
            return resp.status(201).json({
                    matricula:req.body.matricula, 
                    token: token
                });
        } catch (e) {
            console.log("erro ao tentar criar novo aluno");
            return resp.status(404).json({message: e});
        }
    } 
    return resp.status(400).json({message:"Informações faltando na requisição"});
});


router.post("/login", async (req,resp) => {
    if(req.body.matricula != undefined && req.body.senha != undefined) {
        try{
            aluno = await Aluno.login(req.body.senha, req.body.matricula);
            token = jwtService.criarToken(req.body.matricula ,aluno.id, req.body.senha);
            return resp.status(200).json({
                matricula:req.body.matricula,
                token: token
            });
        } catch(e) {
            console.log("erro no login");
            return resp.status(404).json({message: e});
        }
    } 
    return resp.status(400).json({messsage: "Informações requeridas não foram enviadas"});

});

router.use("/detalhes", jwtService.validar("ROLE_ALUNO"));

router.get("/detalhes", async (req,resp) => {
    aluno = await Aluno.getById(req.user.id);
    console.log(aluno);
    resp.status(200).json(aluno);
})

module.exports = router;