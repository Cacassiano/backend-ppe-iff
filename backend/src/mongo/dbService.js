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

module.exports = {
    create_new,
}