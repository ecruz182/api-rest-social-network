//Accion de prueba
export const testUser = (req, res) =>{
    return res.status(200).send({
        message: "mensaje ok user"
    });
}