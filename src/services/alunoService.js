const model = require('../models/Aluno');

const save = (body) => model.create(body);

module.exports = {
    save,
}