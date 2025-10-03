const Refeicao = require('../models/Refeicao');


module.exports = class RefeicaoService {
    constructor() {
        this.teste = "teste";
    }

    async createManyRefeicao(refeicoes, cardapio) {
        refeicoes = await Refeicao.insertMany(refeicoes);
        refeicoes.forEach(ref => {
            cardapio[ref.tipo_refeicao].push(ref);
        });
    }
       
    async updateRefeicoes(refeicoes, cardapio) {
        
        for (let i = 0; i < refeicoes.length; i++) {
            const refeicao = await Refeicao.findById(refeicoes[i]._id);
            if(!refeicao) continue;
            // Salva o tipo de refeicao antigo para atualizar o cardapio depois
            const tipo_ref_antigo = refeicao.tipo_refeicao;
            
            Object.assign(refeicao, refeicoes[i]);
            await refeicao.save();

            // Atualiza o cardapio
            let index;
            cardapio[tipo_ref_antigo].forEach((ref, idx) => {
                if(ref._id.toString() === refeicao._id.toString()) {
                    index = idx;
                    return;
                }
            });
            // console.log("lista antes de deletar: "+cardapio[tipo_ref_antigo] + " index a deletar: "+index);
            if(index>=0) cardapio[tipo_ref_antigo].splice(index, 1);
            cardapio[refeicao.tipo_refeicao].push(refeicao);
            // console.log("index deletado: "+index+" lista depois de deletar: "+cardapio[tipo_ref_antigo]);

        }
    }


    async deleteRefeicoes(refeicoes, cardapio) {
        const ids = refeicoes.map(r => r._id);
        const {deletedCount} = await Refeicao.deleteMany({_id: {$in: ids}});
        console.log("esperados deletados: "+ids.length);
        console.log("deletados: "+deletedCount); 

        for(let i=0; i<refeicoes.length; i++) {
            if(cardapio[refeicoes[i].tipo_refeicao]===undefined) return;
            let index;
            // console.log("deletar: "+refeicoes[i]._id+" da lista: "+cardapio[refeicoes[i].tipo_refeicao]+"\n");
            // console.log("index antes de deletar: "+index+"\n");
            cardapio[refeicoes[i].tipo_refeicao].forEach((r, idx) => {
                if(refeicoes[i]._id.toString() === r._id.toString()){
                    index = idx;
                    return;
                }
            });
            if(index>=0) cardapio[refeicoes[i].tipo_refeicao].splice(index, 1);
        }
        // console.log(cardapio);
    }
}