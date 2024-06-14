import { connect } from "mongoose";

const connection = async() =>{
    try{
        await connect("mongodb://localhost:27017/db_socialnet");
        console.log("Conectado correctamente a las base de datos")
    }catch(error){
        console.log(error);
        throw new error("No se pudo conectar a la base de datos")
    }
}

export default connection;