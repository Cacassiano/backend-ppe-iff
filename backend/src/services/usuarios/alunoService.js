const model = require('../../models/Aluno');
const bcriptService = require('../seguranca/criptografiaService');
const dbService = require("../../mongo/dbService")

const login = async (senha, mat) => {
    aluno = await model.findOne({matricula: mat});
    if(!aluno) return null;
    if(!bcriptService.comparar(senha, aluno.senha)) return null;
    console.log(aluno)
    return aluno;
}

const save = async (body) => {
    body['senha'] = bcriptService.criptografar(body.senha);
    body.roles = ["ROLE_USER", "ROLE_ALUNO"]
    return await dbService.create_new(body, model);
};

const getById = async (id) => {
    aluno =await model.findById(id); 
    console.log(aluno)
    return aluno;
}

module.exports = {
    save,
    login,
    getById,
}