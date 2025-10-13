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

    async update(email, body) {
        const func = await Servidor.findOne({email: email});
        if(!func) return null;
        delete body.senha;
        Object.assign(func, body);
        return await func.save();
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

    async getAllServidores() {
        return await Servidor.find({});
    }

    async getById (id){
        return await Servidor.findOne({_id: id});
    }
} 

module.exports = ServidorService;