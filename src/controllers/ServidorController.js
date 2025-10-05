class ServidorController {
    constructor(ServidorService, JwtService) {
        this.router = require('express').Router();
        this.JwtService = JwtService;
        this.ServidorService = ServidorService;
        this.configurarRotas();
    }

    configurarRotas() {
        this.router.post("/login", this.loginServidor.bind(this));
        this.router.post("/register", this.registrarServidor.bind(this));

        this.router.use("/detalhes", this.JwtService.validar("ROLE_SER"));
        this.router.get("/detalhes", this.detalhesServidor.bind(this));
    }

    async loginServidor(req, resp) {
        if(!req.body.email || !req.body.senha) {
            return resp.status(400).json({message: "Informações faltando na requisição"})
        }
        try{
            const func = await this.ServidorService.login(req.body.senha, req.body.email)
            const token = this.JwtService.criarToken(func.email, func.id, ["ROLE_SER", "ROLE_CANTINA"]);
            resp.status(200).json({
                token: token,
                email: func.email
            })
        } catch(e) {
            return resp.status(404).json({message: e.message});
        }
    }

    async registrarServidor(req, resp) {
        if(!req.body.email || !req.body.nome || !req.body.sobrenome || !req.body.senha) {
            return resp.status(400).json({message: "Informações faltando na requisição"});
        }
        try{
            const senha = req.body.senha;
            const func = await this.ServidorService.save(req.body, ["ROLE_CANTINA"]);

            const token = this.JwtService.criarToken(func.email, func.id, ["ROLE_SER", "ROLE_CANTINA"]);
            resp.status(201).json({
                token: token,
                email: func.email
            })
        } catch(e) {
            if (e.code == 11000) {
                console.error("EMAIL JA REGISTRADA")
                return resp.status(409).json({ message: "Email já cadastrado" });
            }
            return resp.status(500).json({message: e.message});
        }       
    }

    async detalhesServidor(req, resp) {
        const func = await this.ServidorService.getById(req.user.id);
        console.log(func);
        return resp.status(200).json(func);
    }
}

module.exports = ServidorController;