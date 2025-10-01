const model =  require("../models/Funcionario");
const bcript = require('../infra/auth/criptografiaService');
const dbService = require("../mongo/dbService")

const save = async (body, roles) => {
    body.senha = bcript.criptografar(body.senha);
    body.roles = ["ROLE_USER", "ROLE_FUNC"].concat(roles)
    try{
        return await dbService.save(body, model);
    } catch (e) {
        console.error(`ocorreu um erro no FuncionarioService(save): ${e}`)
        throw e;
    }
};

const login = async (senha, identificador) => {
    try{
        func = await dbService.findOneBy({email: identificador}, model);
        if(!bcript.comparar(senha, func.senha)) throw Error("Senha incorreta");
        return func;
    }catch(e) {
        console.error(`ocorreu um erro no FuncionarioService(login): ${e}`);
        throw e;
    }
};

const getById = async (id) => {
    try{
        func = await dbService.findOneBy({_id: id}, model);
        return func
    } catch(e) {
        throw new Error("Funcionario não encontrado");
    }
    
}

module.exports = {
    login,
    save,
    getById,
}