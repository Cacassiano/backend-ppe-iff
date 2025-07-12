const modelCard = require('../../models/Cardapio')
const modelRef = require('../../models/Refeicao')
const dbService = require("../../mongo/dbService")

const getCardapioByData = async (data) => {
    [data,] = data.toISOString().split("T");
    console.log(data)
    cardapio = await dbService.findOneBy({ dia: new Date(data) }, modelCard, modelRef, ['almoco', 'lanche', 'jantar', 'cafe'])
    if (!cardapio) throw "Cardapio não encontrado"
    return cardapio;
}

const createCardapio = async (dia, refeicoes) => {
    [dia,] = dia.toISOString().split("T");
    console.log(dia);
    let cardapio = {
        dia: dia,
        almoco: [],
        jantar: [],
        cafe: [],
        lanche: [],
    };
    /*
        Possivel ajuste futuro: caso criar cardapio der errado, 
        apagar todos as refeicoes criadas no banco,
        para economizar espaço desnecessario
    */
    cardapio = await addRefeicoes(cardapio, refeicoes)
    cardapio = await dbService.save(cardapio, modelCard)
    if (!cardapio) throw new Error("Não foi possivel salvar o cardapio");
    return cardapio;
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
        if (ref.tipo_refeicao === cardapio[ref.tipo_refeicao][i].tipo_refeicao &&
            ref.bebida === cardapio[ref.tipo_refeicao][i].bebida &&
            ref.comida === cardapio[ref.tipo_refeicao][i].comida
        ) {
            return i;
        }
    }
    return -1;
}

const rmRefeicoes = async (cardapio, refeicoes) => {
    for (i = 0; i < refeicoes.length; i++) {
        try {
            index = findIndexRefeicao(refeicoes[i], cardapio);
            console.log(index);
            await dbService.deleteOneBy({ _id: cardapio[refeicoes[i].tipo_refeicao][index]._id }, modelRef);
            cardapio[refeicoes[i].tipo_refeicao].splice(index, 1);
        } catch (e) {
            continue;
        }
    }
    return cardapio;
}
/* Em desenvolvimento */
const updRefeicoes = async (cardapio, refeicoes) => {
    for (i = 0; i < refeicoes.length; i++) {
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
    cardapio = await dbService.findOneBy({ _id: id_cardapio }, modelCard, modelRef, ['almoco', 'lanche', 'jantar', 'cafe']);
    console.log(body)
    if (cardapio == null) throw Error("Cardapio não existe");
    if (body.add != undefined) cardapio = await addRefeicoes(cardapio, body.add);
    if (body.rm != undefined) cardapio = await rmRefeicoes(cardapio, body.rm);
    if (body.upd != undefined) cardapio = await updRefeicoes(cardapio, body.upd);
    dbService.save(cardapio, modelCard);
}

module.exports = {
    getCardapioByData,
    createCardapio,
    refeicao_ops
}