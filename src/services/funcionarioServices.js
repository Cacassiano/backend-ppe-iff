const bcript = require('./criptografiaService');
const model =  require("../models/Funcionario");

const save = (body) => {
    body.senha = bcript.criptografar(body.senha);
    model.create(body)
};
const login = async (senha, identificador) => {
    func = await model.findOne({email: email});
    if(func) {
        return bcript.comparar(senha, func.senha);
    }
    return false;
};