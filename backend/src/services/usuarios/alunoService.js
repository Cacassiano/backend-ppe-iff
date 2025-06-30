const model = require('../../models/Aluno');
const bcriptService = require('../seguranca/criptografiaService');
const dbService = require("../../mongo/dbService")

const login = async (senha, mat) => {
    aluno = await dbService.findOneBy({matricula: mat}, model);
    if(!aluno) throw "Aluno não existe";
    if(!bcriptService.comparar(senha, aluno.senha)) throw "Senha incorreta";
    return aluno;
}

const save = async (body) => {
    body['senha'] = bcriptService.criptografar(body.senha);
    body.roles = ["ROLE_USER", "ROLE_ALUNO"]
    try{
        aluno = await dbService.create_new(body, model);
    } catch (e) {
        throw e;
    }
    return aluno;
};

const getById = async (id) => {
    aluno = await dbService.findOneBy({_id: id}, model); 
    if(!aluno) throw "aluno não encontrado";
    return aluno;
}

module.exports = {
    save,
    login,
    getById,
}