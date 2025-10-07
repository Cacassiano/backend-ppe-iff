const app = require("../app");
const db = require("../src/mongo/db");
const bancoURI = process.env.DB_URL;

async function connect() {
    await db(bancoURI);
}  
connect();
module.exports = app;