const app = require('express')();
const alunoController = require('./src/controllers/alunos/controller')
const db = require("./src/mongo/db");
const port = 8080;

db();
// Conectar a api a determinada porta
app.listen(port);
app.use("/aluno", alunoController);

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

// mapear requisicao tipo GET para o endpoint "/", ou sendo, vazio
app.get("/", (req, resp) => {
    resp.render('main');
});