const create_new = async (data, model) => {
    let objeto
    try{
        objeto = await model.create(data);
    } catch(e){
        console.log(`Erro ao criar novo model no db com os dados: \n ${data} \n`);
        throw e;
    }
    return objeto;
}

const findOneBy = async(querry, model) => {
    let objeto;

    objeto = await model.findOne(querry);
    if (!objeto) return null
    return objeto;
    
}

module.exports = {
    create_new,
    findOneBy,
}