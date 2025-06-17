const model = require('../models/Aluno');
const bcriptService = require('./criptografiaService');

const login = async (senha, mat) => {
    aluno = await model.findOne({matricula: mat})
    if(aluno){
        let a = bcriptService.comparar(senha, aluno.senha);
        console.log(a);
        return a;
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