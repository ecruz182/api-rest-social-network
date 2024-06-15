import status from "express/lib/response.js";
import User from "../models/user.js"
//import bcrypt from "bcrypt";


//Accion de prueba
export const testUser = (req, res) =>{
    return res.status(200).send({
        message: "mensaje ok user"
    });
}

//Registro de usuario
export const register = async (req, res) =>{
    try {
        //Recoge datos de la peticion
        let params = req.body; 

        //Validar los datos
        if(!params.name || !params.last_name || !params.email || !params.password || !params.nick){
            return res.status(400).send({
                status: "error",
                message: "Faltan datos por enviar",
            });
        }

        // Crear una instancia del modelo User con los datos validados
        let user_to_save = new User(params);

        // Buscar si ya existe un usuario con el mismo email o nick
        const existingUser = await User.findOne({
            $or: [
                { email: user_to_save.email.toLowerCase() },
                { nick: user_to_save.nick.toLowerCase() }
            ]
        });

        // Si encuentra un usuario, devuelve un mensaje indicando que ya existe
        if(existingUser) {
            return res.status(409).json({
                status: "error",
                message: "!El usuario ya existe!"
            });
        }

        // Cifrar contraseña
        //const salt = await bcrypt.genSalt(10);
        //const hasedPassword = await bcrypt.hash(user_to_save.password, salt);
        //user_to_save.password = hasedPassword;

        // Guardar el usuario en la base de datos
        await user_to_save.save();

        
        // Devolver respuesta exitosa y el usuario registrado
        return res.status(201).json({
            status: "created",
            message: "Usuario registrado con éxito",
            user: user_to_save
        });


    } catch (error) {
        console.log("Error en registro de usuario", error);
        return res.status(500).json({
            status: "error",
            message:"Error en registro de usuarios"
        })
    }
}


