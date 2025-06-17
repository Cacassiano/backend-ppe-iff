const mongodb = require('mongoose');

// Conectar com o banco de dados
const db_url = process.env.DB_URL;
const conexao = () => {
    console.log("comecou a conexao");
    mongodb.connect(db_url)
    .then(() => console.log("conexao bem sucedida"))
    .catch((err) => console.error(err));
};

module.exports = conexao;