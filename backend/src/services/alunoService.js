const model = require('../models/Aluno');
const bcriptService = require('./criptografiaService');

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
    try{
        aluno = await model.create(body);
    } catch(e){
        console.log(e);
        return null;
    }
    console.log(aluno);
    return aluno;
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