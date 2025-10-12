module.exports = class UserController {
    constructor(userService, tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.router = require("express").Router();
        this.registerRoutes();
    }
    registerRoutes() {
        this.router.get(
            "/", 
            this.tokenService.validar("ROLE_SER", "ROLE_USER"),
            this.getAllUsers.bind(this)
        );
    }
    async getAllUsers(req, resp) {
        try {
            const users = await this.userService.getAllUsers();
            return resp.status(200).json({users: users});
        } catch(e) {
            console.error(e);
            return resp.status(500).json({message: "Erro ao buscar usuários"});
        }
    }
}