//Accion de prueba
export const testPublications = (req, res) =>{
    return res.status(200).send({
        message: "mensaje ok publication"
    });
}