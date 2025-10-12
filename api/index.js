const app = require("../app");
const db = require("../src/mongo/db");
const bancoURI = process.env.DB_URL;
const card = require("../src/models/Cardapio")

async function connect() {
    while(!(await db(bancoURI)));
}  
connect();
module.exports = app;