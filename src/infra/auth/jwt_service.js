const jwt = require('jsonwebtoken');
const chave = (process.env.SECRET_KEY ? process.env.SECRET_KEY: "senha")
const umDiaEmSecs = 60*60*24;


const validarAluno = async (req, resp, next) => {
    [, token] = req.headers.authorization?.split(" ") ||['', '']
    if (!token) return resp.status(401).send("Entrada restrita");
    try {
        const conteudo = await jwt.verify(token, chave);
        console.log(conteudo);
        if(conteudo.id == undefined || conteudo.senha == undefined || !conteudo.role.includes("ROLE_ALUNO")) return resp.status(403).json({message: "token invalido"});
        return next();
    } catch(err) {
        console.log(err);
        return resp.status(403).send("acesso negado");
    }
};

const validarFuncionario = async (req,resp,next) => {
    [, token] = req.headers.authorization?.split(" ") ||['', '']
    if (!token) return resp.status(401).send("Entrada restrita");
    try {
        const conteudo = await jwt.verify(token, chave);
        if(conteudo.id == undefined || conteudo.senha == undefined || !conteudo.role.includes("ROLE_FUNC")) return resp.status(403).json({message: "token invalido"});
        return next();
    } catch(err) {
        console.log(err);
        return resp.status(403).send("acesso negado");
    }
}

const getConteudo = (req) => {
    [, token] = req.headers.authorization?.split(" ") ||['', ''];
    const conteudo = jwt.verify(token, chave);
    return conteudo;
}

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
    validarFuncionario,
    criarToken,
    getConteudo,
    validarAluno,
}