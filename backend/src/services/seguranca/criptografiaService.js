const bcript = require('bcrypt');
const saltRounds = 10;

const criptografar = (senha) => bcript.hashSync(senha, saltRounds);
const comparar = (senha, cripto) => bcript.compareSync(senha, cripto);

module.exports = {
    criptografar,
    comparar,
}