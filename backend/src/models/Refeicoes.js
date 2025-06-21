const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    tipo_refeicao: {
        type: String,
        unique:false,
        required:false
    },
    prato_principal: {
        type:String,
        unique:false,
        required:false
    },
    bebida: {
        type:String,
        required:false,
        unique:false
    }
}, {timestamps:true, id:true});

const model = mongoose.model("Refeicao", schema)

module.exports = model;