const Servidor =  require("../models/Servidor");

class ServidorService {
    constructor(BcriptService) {
        this.BcriptService = BcriptService
    }

    async save (body, roles){
        body.senha = this.BcriptService.criptografar(body.senha);
        body.roles = ["ROLE_USER", "ROLE_SER"].concat(roles);

        const func  = new Servidor(body);
        return await Servidor.create(func);
    }

    async login(senha, iemail) {
        const tempoDeEspera = Date.now(); 
        const func = await Servidor.findOne({email: iemail});
        console.log("tempo total de espera: " + (Date.now() - tempoDeEspera)+ "ms");

        if(!this.BcriptService.isEqual(senha, func.senha)) { 
            throw Error("Senha incorreta");
        }
        
        return func;
    }

    async getById (id){
        return await Servidor.findOne({_id: id});
    }
} 

module.exports = ServidorService;