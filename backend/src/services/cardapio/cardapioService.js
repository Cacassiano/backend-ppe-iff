const modelCard = require('../../models/Cardapio')
const modelRef = require('../../models/Refeicoes')
const dbService = require("../../mongo/dbService")

const getCardapioByData = async(data) => {
    cardapio = await dbService.findOneBy({data:data}, modelCard)
    if (!cardapio) {
        throw "Cardapio não encontrado"
    }
    return cardapio;
}
module.exports = {
    getCardapioByData,
}