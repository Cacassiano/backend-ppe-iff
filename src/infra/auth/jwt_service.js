const jwt = require('jsonwebtoken');
const chave = (process.env.SECRET_KEY ? process.env.SECRET_KEY: "senha")
const umDiaEmSecs = 60*60*24;


const validar = (...roles) => {
    return async (req, resp, next) => 
    {
        [, token] = req.headers.authorization?.split(" ") ||['', '']
        if (!token) return resp.status(401).send("Entrada restrita");
        try {
            const conteudo = await jwt.verify(token, chave);
            console.log(conteudo);
            if(conteudo.id == undefined || conteudo.senha == undefined ) return resp.status(403).json({message: "token invalido"});
            roles.forEach(role => {
                if(!conteudo.role.includes(role)){
                    return resp.status(403).json({message: "acesso não autorizado"});
                }
            })
            req.user = conteudo;
            return next();
        } catch(err) {
            console.log(err);
            return resp.status(403).send("acesso negado");
        }
    }
};

const criarToken = (sujeito, senha, role) => {
    token = jwt.sign({
        id: sujeito,
        senha: senha,
        role: role,
        exp: Date.now()+2*umDiaEmSecs,
    }, chave);

    return token;
}


module.exports = {
    criarToken,
    validar,
}