const save = async (data, model) => {
    let objeto
    try{
        objeto = await new model(data).save();
    } catch(e){
        console.log(`Erro ao criar novo model no db com os dados: \n ${data} \n`);
        throw e;
    }
    return objeto;
}

const findOneBy = async(querry, model, populate=null) => {
    let objeto;
    if(!populate) objeto = await model.findOne(querry).populate(populate).exec();
    else objeto = await model.findOne(querry);
    if (!objeto) return null
    return objeto;
    
}

module.exports = {
    save,
    findOneBy,
}