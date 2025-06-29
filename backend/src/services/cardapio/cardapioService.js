const modelCard = require('../../models/Cardapio')
const modelRef = require('../../models/Refeicao')
const dbService = require("../../mongo/dbService")

const getCardapioByData = async(data) => {
    [data,] = data.toISOString().split("T");
    console.log(data)
    cardapio = await dbService.findOneBy({dia:new Date(data)}, modelCard)
    if (!cardapio) {
        throw "Cardapio não encontrado"
    }
    return cardapio;
}

const createCardapio = async (dia, refeicoes) => {
    [dia,] = dia.toISOString().split("T");
    let cardapio = {
        dia:dia,
        almoco:[],
        jantar: [],
        cafe: [],
        lanche: [],
    };
    /*
        Possivel ajuste futuro: caso criar cardapio der errado, 
        apagar todos as refeicoes criadas no banco,
        para economizar espaço desnecessario
    */
    cardapio = await setRefeicoes(cardapio, refeicoes)
    return await dbService.create_new(cardapio, modelCard);
} 

const setRefeicoes = async (obj, refeicoes) =>{
    for(i = 0; i<refeicoes.length; i++){
        refeicao = await dbService.create_new(refeicoes[i], modelRef);
        if(refeicao){
            obj[refeicao.tipo_refeicao].push(refeicao._id);
        } 
        console.log(obj);
    }
    return obj
}

module.exports = {
    getCardapioByData,
    createCardapio,
}