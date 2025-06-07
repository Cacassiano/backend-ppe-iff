const model = require('../models/Aluno');
const bcriptService = require('./criptografiaService');

const login = async (senha, mat) => {
    aluno = await model.findOne({matricula: mat})
    console.log(aluno);
    if(aluno){
        return bcriptService.comparar(senha, aluno.senha);
    }
    return false;
}

const save = (body) => {
    body['senha'] = bcriptService.criptografar(body.senha);
    model.create(body)
};

module.exports = {
    save,
    login,
}