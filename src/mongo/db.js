const mongodb = require('mongoose');

// Conectar com o banco de dados
const adminPassword = "aS0bsmBaRhw99hL3";
const db_url = "mongodb+srv://admin-db:"+adminPassword+"@ppe-iff-cluster.clsszda.mongodb.net/?retryWrites=true&w=majority&appName=ppe-iff-cluster";
const conexao = () => {
    console.log("comecou a conexao");
    mongodb.connect(db_url)
    .then(() => console.log("conexao bem sucedida"))
    .catch((err) => console.error(err));
};

module.exports = conexao;