const model =  require("../models/Funcionario");
const bcript = require('./criptografiaService');

const save = (body) => {
    body.senha = bcript.criptografar(body.senha);
    model.create(body);
};
const login = async (senha, identificador) => {
    func = await model.findOne({email: identificador});
    if(func) {
        return bcript.comparar(senha, func.senha);
    }
    return false;
};

const getByEmail = async (email) => {
    func = await model.findOne({email: email});
    return {
        nome: func.nome,
        sobrenome: func.sobrenome,
        email: func.email,
    }
}

module.exports = {
    login,
    save,
    getByEmail,
}