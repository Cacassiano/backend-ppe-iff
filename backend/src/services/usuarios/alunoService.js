const model = require('../../models/Aluno');
const bcriptService = require('../../infra/auth/criptografiaService');
const dbService = require("../../mongo/dbService")

const login = async (senha, mat) => {
    aluno = await dbService.findOneBy({matricula: mat}, model);
    if(!aluno) throw Error("Aluno não existe");
    if(!bcriptService.comparar(senha, aluno.senha)) throw Error("Senha incorreta");
    return aluno;
}

const save = async (body) => {
    body['senha'] = bcriptService.criptografar(body.senha);
    body.roles = ["ROLE_USER", "ROLE_ALUNO"]
    try{
        aluno = await dbService.save(body, model);
        return aluno;
    } catch (e) {
        console.error("erro alunoService: ", e.message);
        throw e;
    }
    return aluno;
};

const getById = async (id) => {
    aluno = await dbService.findOneBy({_id: id}, model); 
    if(!aluno) return null;
    return aluno;
}

module.exports = {
    save,
    login,
    getById,
}