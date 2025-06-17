const mongoose = require('mongoose');

const schema = mongoose.Schema({
    nome: {
        type:String,
        unique:false,
        required:true
    },
    sobrenome: {
        type: String,
        unique: false,
        required:false
    },
    email: {
        type: String,
        unique:true,
        required:true,
    },
    senha: {
        type: String,
        unique:false,
        required: true,
    }
});

const model = mongoose.model("Funcionario", schema);

return model;