const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    tipo_refeicao: {
        type: String,
        unique:false,
        required:true
    },
    comida: {
        type:String,
        unique:false,
        required:true
    },
    bebida: {
        type:String,
        default:"NA",
        unique:false
    }
}, {timestamps:true, id:true});

const model = mongoose.model("Refeicao", schema)

module.exports = model;