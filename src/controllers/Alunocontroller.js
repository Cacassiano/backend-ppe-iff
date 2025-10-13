const express = require('express');

class AlunoController {
    constructor(AlunoService, JwtService) {
        this.AlunoService = AlunoService;
        this.JwtService = JwtService;
        this.router = express.Router();
        this.registrarRotas();
    }

    registrarRotas() {
        this.router.post("/register", this.registrarAluno.bind(this));
        this.router.post("/login", this.loginAluno.bind(this));

        this.router.use("/detalhes", this.JwtService.validar("ROLE_ALUNO"),this.detalhesAluno.bind(this));
        this.router.use("/:matricula", this.JwtService.validar("ROLE_SER"), this.updateAluno.bind(this));

        this.router.use("/validate", this.JwtService.validar("ROLE_ALUNO"));
        this.router.get("/validate", this.validarToken.bind(this));
        
    }

    async updateAluno(req, resp) {
        try {
            if(!req.params.matricula) {
                return resp.status(400).json({message: "Matricula não foi informada"})
            }
            const new_aluno = await this.AlunoService.update(req.params.matricula, req.body);
            if(!new_aluno){
                return resp.status(404).json({message: "Aluno não encontrado"})
            }
            return resp.status(200).json({aluno: new_aluno})
        }catch(e) {
            return resp.status(500).json({message: e.message})
        }
    }


    async registrarAluno(req, resp) {
        if (!req.body.matricula || !req.body.nome || !req.body.sobrenome || !req.body.podeAlmocar || !req.body.senha) {
            return resp.status(400).json({ message: "Informações faltando na requisição" });
        }

        const senha = req.body.senha;
        req.body.podeAlmocar = (req.body.podeAlmocar == "sim");
        try {
            const aluno = await this.AlunoService.save(req.body);
            const token = this.JwtService.criarToken(req.body.matricula, aluno.id, "ROLE_ALUNO");
            return resp.status(201).json({
                matricula: aluno.matricula,
                token: token
            });
        } catch (e) {
            if (e.code == 11000) {
                console.error("MATRICULA JA REGISTRADA");
                return resp.status(409).json({ message: "Matrícula já cadastrada" });
            }
            console.error("erro ao tentar criar novo aluno: " + e.message);
            return resp.status(404).json({ message: e.message });
        }
    }

    validarToken(req, resp) {
        return resp.status(200).json({ message: "Token valido" });
    }

    async loginAluno(req, resp) {
        if (!req.body.matricula || !req.body.senha)
            return resp.status(400).json({ message: "Informações requeridas não foram enviadas" });
        try {
            const aluno = await this.AlunoService.login(req.body.senha, req.body.matricula);
            const token = this.JwtService.criarToken(aluno.matricula, aluno.id, "ROLE_ALUNO");
            return resp.status(200).json({
                matricula: aluno.matricula,
                token: token
            });
        } catch (e) {
            console.log(e);
            return resp.status(404).json({ message: e.message });
        }
    }

    async detalhesAluno(req, resp) {
        try {
            const aluno = await this.AlunoService.getById(req.user.id);
            return resp.status(200).json(aluno);
        } catch (e) {
            return resp.status(404).json({ message: e.message });
        }
    }
}

module.exports = AlunoController;