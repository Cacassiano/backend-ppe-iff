const jwt = require('jsonwebtoken');
const chave = (process.env.SECRET_KEY ? process.env.SECRET_KEY: "senha")
const umDiaEmSecs = 60*60*24;

const validar = async (req, resp, next) => {
    [, token] = req.headers.authorization?.split(" ") ||['', '']
    if (!token) return resp.status(401).send("Entrada restrita");
    try {
        const conteudo = await jwt.verify(token, chave);
        if(conteudo.id == undefined || conteudo.senha == undefined) return resp.status(403).json({message: "token invalido"});
        return next();
    } catch(err) {
        console.log(err);
        return resp.status(403).send("acesso negado");
    }
};

const criarToken = (sujeito, senha) => {
    token = jwt.sign({
        id: sujeito,
        senha: senha,
        exp: Date.now()+2*umDiaEmSecs
    }, chave);

    return token;
}


module.exports = {
    validar,
    criarToken,
}