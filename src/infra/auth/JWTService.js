const jwt = require('jsonwebtoken');

class JwtService {
    constructor(AlunoService, ServidorService, BcriptService) {
        this.AlunoService = AlunoService;
        this.ServidorService = ServidorService;
        this.BcriptService = BcriptService;

        this.tempoExpiracao = 60*60*24;
        this.chave = (process.env.SECRET_KEY ? process.env.SECRET_KEY: "senha");
    }

    validar(...roles) {
        return async (req, resp, next) => 
        {
            // Pega o token do cabeçalho Authorization
            const [, token] = req.headers.authorization?.split(" ") ||['', '']
            // Verifica se o token foi fornecido
            if (!token) return resp.status(401).send("Entrada restrita");
            try {
                // Descodifica o token
                const conteudo = await jwt.verify(token, this.chave);
                // Verifica se o token contém os campos necessários
                if(conteudo.id === undefined || conteudo.senha === undefined || conteudo.subject === undefined ) {
                    return resp.status(403).json({message: "token invalido"});
                }
                
                // Procura o sujeito no banco de dados
                let sujeito = await this.findSujeito(conteudo);
                if(!sujeito) {
                    return resp.status(403).json({message: "token invalido"});
                } 
                // Verifica se as roles do sujeito incluem todas as roles requeridas
                this.validarRoles(sujeito.roles, roles);

                // Verifica se a senha no token corresponde à senha atual do sujeito
                if(!this.BcriptService.isEqual(conteudo.senha, sujeito.senha)) {
                    return resp.status(403).json({message: "token invalido"});
                }
                // Adiciona as informações do usuário à requisição
                req.user = conteudo;
                return next();
            } catch(err) {
                console.log(err);
                return resp.status(403).json({message: "acesso negado" , message:err.message});
            }
        }
    }

    validarRoles = (sujeitoRoles, rolesRequeridas) => {
        // console.log(sujeitoRoles)
        // console.log(rolesRequeridas)
        rolesRequeridas.forEach(role => {
            if(!sujeitoRoles.includes(role)){
                return resp.status(403).json({message: "acesso não autorizado"});
            }
        })
    }
    criarToken = (sujeito, id, senha) => {
        // Cria o token JWT com os dados do sujeito e tempo de expiração
        // Sujeito pode ser matrícula ou email
        // id é o id do usuário no banco de dados
        // senha é a senha do usuário (não criptografada)
        const token = jwt.sign({
            subject: sujeito,
            id: id,
            senha: senha,
            exp: Date.now()+2*this.tempoExpiracao,
        }, this.chave);

        return token;
    }

    async findSujeito (conteudo){
        try {
            const sujeito = await this.AlunoService.getById(conteudo.id);
            if(sujeito) return sujeito;
            return await this.ServidorService.getById(conteudo.id);
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}  

module.exports = JwtService;