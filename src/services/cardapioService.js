const Cardapio = require('../models/Cardapio')

module.exports = class CardapioService {
    constructor(RefeicaoService) {
        this.RefeicaoService = RefeicaoService;
    }

    async getCardapioByData(data) {
        [data,] = data.toISOString().split("T");

        tempoDeEspera = Date.now(); 
        const cardapio = await Cardapio
            .find({ dia: {$gte: new Date(data)} })
            .populate('almoco')
            .populate('jantar')
            .populate('cafe')
            .populate('lanche');
        console.log("tempo total de espera: " + (Date.now() - tempoDeEspera)+ "ms");
        return cardapio;
    }

    async getCardapioById(id) {
        return await Cardapio
            .findById(id)
            .populate('almoco')
            .populate('jantar')
            .populate('cafe')
            .populate('lanche');
    }
    async createCardapio(dia, refeicoes) {
        console.log(dia);
        let cardapio = {
            dia: dia,
            almoco: [],
            jantar: [],
            cafe: [],
            lanche: [],
        };
        if(refeicoes) {
            await this.RefeicaoService.createManyRefeicao(refeicoes, cardapio);
        }
        return await Cardapio.create(cardapio);
    }

    async updateRefeicoes({add, rm, upd}, id_cardapio) {
        const cardapio = await this.getCardapioById(id_cardapio);
        if(!cardapio) return null

        if(add) await this.RefeicaoService.createManyRefeicao(add, cardapio);
        if(upd) await this.RefeicaoService.updateRefeicoes(upd, cardapio);
        if(rm) await this.RefeicaoService.deleteRefeicoes(rm, cardapio);

        return await cardapio.save();
    }

    async deleteCardapio(id_cardapio) {
        return await Cardapio.findByIdAndDelete(id_cardapio);
    }

    async updateCardapio(dia, id_cardapio) {
        const cardapio = await this.getCardapioById(id_cardapio);
        if(!cardapio) return null;

        cardapio.dia = dia;
        return await cardapio.save();
    }
}