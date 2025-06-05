const app = require('express')();
const port = 3000;
const db = require("./src/mongo/db");

db();
// Conectar a api a determinada porta
app.listen(port);

// mapear requisicao tipo GET para o endpoint "/", ou sendo, vazio
app.get("/", (req, resp) => {
    resp.send("hello world!");
});