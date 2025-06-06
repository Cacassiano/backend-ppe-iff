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
        unique:true
    },
    podeAlmocar: {
        type:Boolean,
        required: true
    }
});
const entity = mongoose.model("Aluno", schema);

module.exports = entity;