const model =  require("../../models/Funcionario");
const bcript = require('../../infra/auth/criptografiaService');
const dbService = require("../../mongo/dbService")

const save = async (body, roles) => {
    body.senha = bcript.criptografar(body.senha);
    body.roles = ["ROLE_USER", "ROLE_FUNC"].concat(roles)
    try{
        return await dbService.save(body, model);
    } catch (e) {
        return null;
    }
};

const login = async (senha, identificador) => {
    func = await model.findOne({email: identificador});
    if(func) {
        return func;
    }
    return false;
};

const getById = async (id) => {
    func = await model.findById(id);
    return func
}

module.exports = {
    login,
    save,
    getById,
}