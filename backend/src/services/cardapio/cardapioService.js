const modelCard = require('../../models/Cardapio')
const modelRef = require('../../models/Refeicao')
const dbService = require("../../mongo/dbService")

const getCardapioByData = async (data) => {
    [data,] = data.toISOString().split("T");
    try{    
        cardapio = await dbService.findOneBy({ dia: new Date(data) }, modelCard, modelRef, ['almoco', 'lanche', 'jantar', 'cafe'])
        return cardapio;
    } catch(e) {
        throw new Error("Cardapio não encontrado");
    }
}

const createCardapio = async (dia, refeicoes) => {
    console.log(dia);
    let cardapio = {
        dia: dia,
        almoco: [],
        jantar: [],
        cafe: [],
        lanche: [],
    };
    try{
        cardapio = await addRefeicoes(cardapio, refeicoes);
        cardapio = await dbService.save(cardapio, modelCard);
        return cardapio;
    } catch(e) {
        console.error(`Erro na parte de crir cardapio: ${e}`);
        rmRefeicoes(cardapio, refeicoes);
        throw e;
    }
    
    
}

const addRefeicoes = async (cardapio, refeicoes) => {
    for (i = 0; i < refeicoes.length; i++) {
        refeicao = await dbService.save(refeicoes[i], modelRef);
        if (refeicao) {
            cardapio[refeicao.tipo_refeicao].push(refeicao._id);
        }
    }
    return cardapio;
}
function findIndexRefeicao(ref, cardapio) {
    for (i = 0; i < cardapio[ref.tipo_refeicao].length; i++) {
        if (ref.bebida === cardapio[ref.tipo_refeicao][i].bebida && ref.comida === cardapio[ref.tipo_refeicao][i].comida) {
            return i;
        }
    }
    return -1;
}

const rmRefeicoes = async (cardapio, refeicoes) => {
    cardapio = await dbService.populateThis(modelRef, cardapio,['almoco', 'lanche', 'jantar', 'cafe']);
    for (let i = 0; i < refeicoes.length; i++) {
        try {
            index = findIndexRefeicao(refeicoes[i], cardapio);
            console.log(index);
            await dbService.deleteOneBy({ _id: cardapio[refeicoes[i].tipo_refeicao][index]._id }, modelRef);
            cardapio[refeicoes[i].tipo_refeicao].splice(index, 1);
        } catch (e) {
            console.error(e)
            continue;
        }
    }
    return cardapio;
}
/* Em desenvolvimento */
const updRefeicoes = async (cardapio, refeicoes) => {
    cardapio = await dbService.populateThis(modelRef, cardapio,['almoco', 'lanche', 'jantar', 'cafe']);
    for (let i = 0; i < refeicoes.length; i++) {
        refeicao = await dbService.findOneBy({_id: refeicoes[i]._id}, modelRef);
        tipo_ref_antigo = refeicao.tipo_refeicao;
        // Tiro ref do cardapio
        index = findIndexRefeicao(refeicao, cardapio);
        cardapio[refeicao.tipo_refeicao].splice(index, 1);
        // atualizo a refeicao
        refeicao.tipo_refeicao = refeicoes[i].tipo_refeicao;
        refeicao.comida = refeicoes[i].comida;
        refeicao.bebida = refeicoes[i].bebida;
        
        try{
            await dbService.save(refeicao, modelRef);
        } catch(e) {
            console.error(e);
            cardapio[tipo_ref_antigo].push(refeicao._id);
            continue;
        }
        // boto de novo no cardapio
        cardapio[refeicao.tipo_refeicao].push(refeicao._id);
    }
    return cardapio;
}

const refeicao_ops = async (body, id_cardapio) => {
    try{ cardapio = await dbService.findOneBy({ _id: id_cardapio }, modelCard); } 
    catch(e){ throw new Error("Cardapio não encontrado"); }

    if (cardapio == null) throw Error("Cardapio não existe");
    if (body.add != undefined) cardapio = await addRefeicoes(cardapio, body.add);
    if (body.rm != undefined) cardapio = await rmRefeicoes(cardapio, body.rm);
    if (body.upd != undefined) cardapio = await updRefeicoes(cardapio, body.upd);
    return await dbService.save(cardapio, modelCard);
}

module.exports = {
    getCardapioByData,
    createCardapio,
    refeicao_ops
}