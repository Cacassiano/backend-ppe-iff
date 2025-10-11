const mongodb = require('mongoose');

// Conectar com o banco de dados
const conexao = async (uri) => {
    try {
        console.log("Iniciando conexao com o banco...");
        console.log("URI recebida:", uri);
        console.log("mongoose.connect existe?", typeof mongodb.connect);
        await mongodb.connect(uri);
        console.log("Conexao com o MongoDB estabelecida");
        return true
    } catch (err) {
        console.error("Erro ao conectar no MongoDB:", err.message);
        return false
    }
};

module.exports = conexao;
