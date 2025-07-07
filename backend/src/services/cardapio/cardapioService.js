const modelCard = require('../../models/Cardapio')
const modelRef = require('../../models/Refeicao')
const dbService = require("../../mongo/dbService")

const getCardapioByData = async(data) => {
    [data,] = data.toISOString().split("T");
    console.log(data)
    cardapio = await dbService.findOneBy({dia:new Date(data)}, modelCard, ['almoco', 'lanche', 'jantar', 'cafe'])
    if (!cardapio) throw "Cardapio não encontrado"
    return cardapio;
}

const createCardapio = async (dia, refeicoes) => {
    [dia,] = dia.toISOString().split("T");
    console.log(dia);
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
    cardapio = await dbService.save(cardapio, modelCard)
    if(!cardapio) throw new Error("Não foi possivel salvar o cardapio");
    return cardapio;
} 

const setRefeicoes = async (cardapio, refeicoes) =>{
    for(i = 0; i<refeicoes.length; i++){
        refeicao = await dbService.save(refeicoes[i], modelRef);
        if(refeicao){
            cardapio[refeicao.tipo_refeicao].push(refeicao._id);
        } 
    }
    return cardapio;
}

const refeicao_ops = async( body, id_cardapio) => {
    cardapio = await dbService.findOneBy({_id: id_cardapio}, modelCard);
    if(cardapio == null) throw Error("Cardapio não existe");
    if(body.add != undefined)cardapio = await setRefeicoes(cardapio, body.add);
    if(body.rm != undefined) return null;
    if(body.upd != undefined) return null;
    dbService.save(cardapio, modelCard);
}

module.exports = {
    getCardapioByData,
    createCardapio,
    refeicao_ops
}