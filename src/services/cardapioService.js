const Cardapio = require('../models/Cardapio')

module.exports = class CardapioService {
    constructor(RefeicaoService) {
        this.RefeicaoService = RefeicaoService;
    }

    async getCardapioByData(data) {
        

        const tempoDeEspera = Date.now(); 
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
        console.log(refeicoes)
        if(refeicoes) {
            await this.RefeicaoService.createManyRefeicao(refeicoes, cardapio);
        }
        return await Cardapio.create(cardapio);
    }

    async updateRefeicoes({add, rm, upd}, cardapio) {
        if(add) await this.RefeicaoService.createManyRefeicao(add, cardapio);
        if(upd) await this.RefeicaoService.updateRefeicoes(upd, cardapio);
        if(rm) await this.RefeicaoService.deleteRefeicoes(rm, cardapio);

    }

    async deleteCardapio(id_cardapio) {
        const cardapio = await this.getCardapioById(id_cardapio);

        this.RefeicaoService.deleteRefeicoes(cardapio.almoco,cardapio);
        this.RefeicaoService.deleteRefeicoes(cardapio.cafe,cardapio);
        this.RefeicaoService.deleteRefeicoes(cardapio.lanche,cardapio);
        this.RefeicaoService.deleteRefeicoes(cardapio.jantar,cardapio);
        
        return await Cardapio.deleteOne({_id: id_cardapio});
    }

    async updateCardapio(dia, id_cardapio, body) {
        let cardapio = await this.getCardapioById(id_cardapio);
        if(!cardapio) return null;

        await this.updateRefeicoes({add: body.add, rm: body.rm, upd: body.upd}, cardapio)
        if(dia) cardapio.dia = dia;
        console.log("cardapio atualizado: "+cardapio);
        return await cardapio.save();
    }
}