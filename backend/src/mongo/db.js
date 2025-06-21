const mongodb = require('mongoose');

// Conectar com o banco de dados
const conexao = async () => {
    try {
        console.log("Iniciando conexao com o banco...");
        await mongodb.connect(process.env.DB_URL);
        console.log("Conexao com o MongoDB estabelecida");
    } catch (err) {
        console.error("Erro ao conectar no MongoDB:", err.message);
    }
};

module.exports = conexao;
