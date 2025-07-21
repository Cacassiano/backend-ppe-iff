const save = async (data, model) => {
    let objeto = new model(data);
    try{
        objeto = await objeto.save();
    } catch(e){
        console.log(`Erro ao criar novo model no db com os dados: \n ${data} \n`);
        throw e;
    }
    return objeto;
}

const findOneBy = async(querry, model, populateModel=null, populatePaths = null) => {
    objeto = await model.findOne(querry);
    if (!objeto) throw new Error(`Não foi possível encontrar um objeto com as características ${querry}`);
    objeto = (populateModel ? await populateModel.populate(objeto, {path: populatePaths}): objeto);
    return objeto;
    
}
const deleteOneBy = async (querry, model) => {
    object = await model.deleteOne(querry);
    if(!object) throw new Error(`Nenhum item foi deletado querry: ${querry}`);
    return object
}

module.exports = {
    save,
    findOneBy,
    deleteOneBy,
}