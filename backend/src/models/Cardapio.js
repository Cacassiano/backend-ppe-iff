const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    dia_correspondente: {
        type: Date,
        required: false,
        unique:true
    }, 
    refeicoes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Refeicoes"
        }
    ],
}, {timestamps: true, id: true});

const model = mongoose.model("Cardapio", schema)

module.exports = model;