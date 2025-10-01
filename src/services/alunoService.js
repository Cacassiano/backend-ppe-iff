const model = require('../models/Aluno');
const bcriptService = require('../infra/auth/criptografiaService');
const dbService = require("../mongo/dbService");
const { response } = require('express');

const login = async (senha, mat) => {
    try{
        aluno = await dbService.findOneBy({matricula: mat}, model);
        if(!bcriptService.comparar(senha, aluno.senha)) throw Error("Senha incorreta");
        return aluno;
    }catch(e) {
        console.error("Erro no alunoservice na parte de login:\n" + e);
        throw e;
    }
}

const save = async (body) => {
    body['senha'] = bcriptService.criptografar(body.senha);
    body.roles = ["ROLE_USER", "ROLE_ALUNO"]
    try{
        aluno = await dbService.save(body, model);
        return aluno;
    } catch (e) {
        console.error("erro alunoService:\n", e);
        throw e;
    }
};

const getById = async (id) => {
    try{
        aluno = await dbService.findOneBy({_id: id}, model); 
        return aluno;
    } catch(e) {
        console.error(e);
        throw e;
    }
    
}

module.exports = {
    save,
    login,
    getById,
}