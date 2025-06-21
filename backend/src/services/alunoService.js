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
    model.create(body);
};

const getByMatricula = async (mat) => {
    aluno =await model.findOne({matricula: mat}); 
    console.log(aluno)
    return {
        nome: aluno.nome,
        sobrenome: aluno.sobrenome,
        matricula: aluno.matricula,
        email: aluno.email,
        podeAlmocar: aluno.podeAlmocar
    };
}

module.exports = {
    save,
    login,
    getByMatricula,
}