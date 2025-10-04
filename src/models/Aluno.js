const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    matricula: {
        type: String,
        required: true,
        unique:true
    },
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required:false,
        
    },
    podeAlmocar: {
        type:Boolean,
        required: true
    },
    roles: [
        {
            type:String,
            default:"ROLE_ALUNO"
        }
    ]
}, {id:true});
const entity = mongoose.model("Aluno", schema);

module.exports = entity;