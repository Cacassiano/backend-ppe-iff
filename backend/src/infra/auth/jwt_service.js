const jwt = require('jsonwebtoken');
const chave = (process.env.SECRET_KEY ? process.env.SECRET_KEY: "senha")
const umDiaEmSecs = 60*60*24;
const alunoService = require('../../services/usuarios/alunoService')
const funcionariosService = require('../../services/usuarios/funcionarioServices')
const bcriptService = require('../../services/seguranca/criptografiaService')


const validar = (...roles) => {
    return async (req, resp, next) => 
    {
        [, token] = req.headers.authorization?.split(" ") ||['', '']
        if (!token) return resp.status(401).send("Entrada restrita");
        try {
            const conteudo = await jwt.verify(token, chave);
            if(conteudo.id === undefined || conteudo.senha === undefined || conteudo.subject === undefined ) return resp.status(403).json({message: "token invalido"});

            let sujeito = await alunoService.getById(conteudo.id);
            
            if(!sujeito) sujeito = await funcionariosService.getById(conteudo.id);
            if(!sujeito || !bcriptService.comparar(conteudo.senha, sujeito.senha)) return resp.status(403).json({message: "user nao existe"});
            roles.forEach(role => {
                if(!sujeito.roles.includes(role)){
                    return resp.status(403).json({message: "acesso não autorizado"});
                }
            })
            
            req.user = conteudo;
            return next();
        } catch(err) {
            console.log(err);
            return resp.status(403).json({message: "acesso negado", erro: err});
        }
    }
};

const criarToken = (sujeito, id, senha) => {
    token = jwt.sign({
        subject: sujeito,
        id: id,
        senha: senha,
        exp: Date.now()+2*umDiaEmSecs,
    }, chave);

    return token;
}


module.exports = {
    criarToken,
    validar,
}