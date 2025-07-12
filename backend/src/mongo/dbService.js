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
    let objeto;
    objeto = await model.findOne(querry);
    if (!objeto) return null
    objeto = (populateModel ? await populateModel.populate(objeto, {path: populatePaths}): objeto);
    console.log(objeto);
    return objeto;
    
}
const deleteOneBy = async (querry, model) => {
    let object;
    object = await model.deleteOne(querry);
    console.log(object);
    if(!object) throw new Error("Nenhum item foi deletado");
    return object
}

module.exports = {
    save,
    findOneBy,
    deleteOneBy,
}