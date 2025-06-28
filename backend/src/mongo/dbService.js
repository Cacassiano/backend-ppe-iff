const create_new = async (data, model) => {
    let objeto
    try{
        objeto = await model.create(data);
    } catch(e){
        console.log(e);
        return null;
    }
    console.log(objeto);
    return objeto;
}

const findOneBy = async(querry, model) => {
    let objeto;
    try{
        objeto = await model.findOne(querry);
        console.log(objeto);
        return objeto;
    } catch(e) {
        console.log("###Erro controlado: "+e)
        return null;
    }
}

module.exports = {
    create_new,
    findOneBy,
}