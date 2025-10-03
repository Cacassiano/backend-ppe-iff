const bcrypt = require('bcrypt');

class BcriptService {
    constructor(saltRounds = 10) {
        this.saltRounds = saltRounds;
    }

    criptografar(senha) {
        return bcrypt.hashSync(senha, this.saltRounds);
    }

    isEqual(senha, cripto) {
        return bcrypt.compareSync(senha, cripto);
    }
}

module.exports = BcriptService;