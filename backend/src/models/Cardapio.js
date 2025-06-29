const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    dia: {
        type: Date,
        required: true,
        unique:false
    }, 
    almoco:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Refeicao",
            required: true
        }
    ],
    cafe:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Refeicao",
            required: true
        }
    ],
    lanche:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Refeicao",
            required: true
        }
    ],
    jantar:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Refeicao",
            required: true
        }
    ],

}, {timestamps: true, id: true});

const model = mongoose.model("Cardapio", schema)

module.exports = model;