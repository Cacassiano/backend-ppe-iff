const jwt = require('jsonwebtoken');
const chave = (process.env.SECRET_KEY ? process.env.SECRET_KEY: "senha")

const validar = (req, resp, next) => {
    [, token] = req.headers.authorization?.split(" ") ||['', '']
    if (!token) return resp.status(401).send*("Entrada restrita");
    try {
        const conteudo = jwt.verify(token, chave);
        return next();
    } catch(err) {
        return resp.status(403).send("acesso negado");
    }
};