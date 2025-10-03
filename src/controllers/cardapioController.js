module.exports = class CardapioController {
    constructor(CardapioService, RefeicaoService, JwtService) {
        this.CardapioService = CardapioService;
        this.RefeicaoService = RefeicaoService;
        this.JwtService = JwtService;
        this.router = require('express').Router();

        this.configurarRotas();
    }

    configurarRotas() {
        this.router.get(
            "/:dia", 
            this.JwtService.validar("ROLE_USER"), 
            this.getCardapioByData.bind(this)
        );
        this.router.post(
            "/", 
            // this.JwtService.validar("ROLE_SER", "ROLE_CANTINA"), 
            this.createCardapio.bind(this)
        );
        // Atualiza uma lista de refeicoes do cardápio
        this.router.post(
            "/:id_cardapio/refeicoes", 
            // this.JwtService.validar("ROLE_SER", "ROLE_CANTINA"), 
            this.refeicao_ops.bind(this)
        );
    }


    async getCardapioByData(req, resp) {
        try{
            // Verifica se o parâmetro dia foi enviado
            if(!req.params.dia) {
                return resp.status(400).json({message: "Parâmetro dia não informado"});
            }
            // Converte dia para inteiro se for possível
            if(Number.isInteger(req.params.dia)) req.params.dia = req.params.dia-0;
            // Se o parâmetro dia for "hoje", pega o cardapio do dia atual
            const data = new Date(req.params.dia == "hoje" ? Date.now(): req.params.dia);
            // Pega o cardapio do dia
            const cardapio = await this.CardapioService.getCardapioByData(data);
            if(!cardapio) {
                return resp.status(404).json({message: "Cardapio não encontrado"});
            }

            return resp.status(200).json({
                cardapio: cardapio
            });
        } catch(e) {
            return resp.status(500).json({
                message: "Erro ao procurar cardapio",
                erro: e.message
            });
        }
    }

    async createCardapio(req, resp) {
        try{
            if(!req.body || !req.body.data) {
                return resp.status(400).json({
                    message: "Informações requeridas não foram enviadas"
                });
            }
            // Converte data para inteiro se for possível
            if(Number.isInteger(req.body.data)) req.body.data = req.body.data-0;
            // Cria o cardapio
            const cardapio = await this.CardapioService.createCardapio(
                new Date(req.body.data).toISOString().split("T")[0], 
                req.body.refeicoes
            );
            // Verifica se o cardapio foi criado
            if(!cardapio) throw new Error("Erro desconhecido");
            return resp.status(201).json({
                cardapio:cardapio
            });

        } catch(e) {
            // console.error("criar cardapio falhou: " + e);
            if(e.code == 11000) {
                return resp.status(409).json({
                    message: "Já existe um cardapio para esse dia"
                });
            }
            return resp.status(500).json({
                message: "Erro ao tentar criar cardapio",
                erro: e.message
            });
        }
    }

    async refeicao_ops(req, resp) {    
        try{
            if(!req.params.id_cardapio || (!req.body.add && !req.body.rm && !req.body.upd) ){
                return resp.status(400).json({message: "Informações requeridas nao informadas"});
            }
            
            const new_cardapio = await this.CardapioService.updateRefeicoes(req.body, req.params.id_cardapio);
            if(!new_cardapio) {
                return resp.status(404).json({message: "Cardapio não encontrado"});
            }
            return resp.status(200).json({
                cardapio: new_cardapio
            })
        } catch(e) {
            console.error(e);
            return resp.status(500).json({
                message: "Ocorreu um erro ao tentar fazer as operações", 
                erro: e.message
            });
        }
    }
}
/*
    Response:
    cardapio: {
        dia: dia,
        almoco: [...],
        jantar: [...],
        cafe: [...],
        lanche: [...],
    }
*/

// Create cardapio
/*
    REQUEST: 

    (obrigatorio)data: Inteiro/String,
    (opcional)refeicoes: [
        {
            tipo_refeicao: String,
            comida: String,
            bebida: String
        },
        {
            tipo_refeicao: String,
            comida: String,
            bebida: String
        }...
    ]
*/


// create
/*
    RESPONSE:
    cardapio = {
        dia: dia,
        almoco: [...],
        jantar: [...],
        cafe: [...],
        lanche: [...],
    };

*/

// Update refs
/*
    REQUEST:
    upd: [
        {
            _id: String,
            tipo_refeicao: String,
            comida: String,
            bebida: String
        }
        ...
    ],
    rm:  [
        {
            tipo_refeicao: String,
            comida: String,
            bebida: String
        }
        ...
    ],
    add: [
        {
            tipo_refeicao: String,
            comida: String,
            bebida: String
        }
        ...
    ]
*/

/*
    RESPONSE:
    cardapio: {
        dia: dia,
        almoco: [...],
        jantar: [...],
        cafe: [...],
        lanche: [...],
    }

*/
