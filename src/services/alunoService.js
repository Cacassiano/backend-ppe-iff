const Aluno = require('../models/Aluno');

class AlunoService {
    constructor(BcriptService) {
        this.BcriptService = BcriptService;
    }

    async login(senha, mat) {
        const aluno = await Aluno.findOne({matricula: mat});
        if(!aluno) throw new Error("Aluno não existe")

        if(!this.BcriptService.isEqual(senha, aluno.senha)) {
            throw Error("Senha incorreta");
        }
        return aluno;
    }

    async save(body) {
        body['senha'] = this.BcriptService.criptografar(body.senha);
        body.roles = ["ROLE_USER", "ROLE_ALUNO"];

        const aluno = new Aluno(body);
        console.log("aluno: ", aluno);  
        
        return await Aluno.create(aluno); 
    }

    async getById (id) {
        return await Aluno.findOne({_id: id});
    }
} 

module.exports = AlunoService
