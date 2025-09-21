const save = async (data, model) => {
    let objeto = new model(data);
    try{
        objeto = await objeto.save();
    } catch(e){
        console.log(`Erro ao criar novo model no db com os dados enviados\n`);
        throw e;
    }
    return objeto;
}

const findOneBy = async(querry, model, populateModel=null, populatePaths = null) => {
    objeto = await model.findOne(querry);
    if (!objeto) throw new Error(`Não foi possível encontrar um objeto com as características dadas`);
    objeto = (populateModel ? await populateModel.populate(objeto, {path: populatePaths}): objeto);
    return objeto;
}
const populateThis = async( populateModel,objeto,populatePaths) => {
    try{
        return await populateModel.populate(objeto, {path: populatePaths})
    }catch(e){
        return objeto;
    }
}
const deleteOneBy = async (querry, model) => {
    object = await model.deleteOne(querry);
    if(!object) throw new Error(`Nenhum item foi deletado`);
    return object
}

module.exports = {
    save,
    findOneBy,
    deleteOneBy,
    populateThis,
}