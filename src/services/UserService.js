module.exports = class UserService {
    constructor(AlunoService, ServidorService) {
        this.AlunoService = AlunoService;
        this.ServidorService = ServidorService;
    }
    async getAllUsers() {
        const alunos = await this.AlunoService.getAllAlunos();
        const servidores = await this.ServidorService.getAllServidores();
        return [...alunos, ...servidores];
    }
}