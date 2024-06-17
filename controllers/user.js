import User from "../models/user.js"
import bcrypt from "bcrypt";
import { createToken } from "../services/jwt.js"
import user from "../models/user.js";


//Accion de prueba
export const testUser = (req, res) => {
    return res.status(200).send({
        message: "mensaje ok user"
    });
}

//Registro de usuario
export const register = async (req, res) => {
    try {
        //Recoge datos de la peticion
        let params = req.body;

        //Validar los datos
        if (!params.name || !params.last_name || !params.email || !params.password || !params.nick) {
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
        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "!El usuario ya existe!"
            });
        }

        // Cifrar contraseña
        const salt = await bcrypt.genSalt(10);
        const hasedPassword = await bcrypt.hash(user_to_save.password, salt);
        user_to_save.password = hasedPassword;

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
        return res.status(500).send({
            status: "error",
            message: "Error en registro de usuarios"
        })
    }
}

//Metodo para autenticar usuarios

// Método para autenticar usuarios
export const login = async (req, res) => {
    try {

        // Recoger los parámetros del body
        let params = req.body;

        // Validar si llegaron el email y password
        if (!params.email || !params.password) {
            return res.status(400).send({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        // Buscar en la BD si existe el email que nos envió el usuario
        const user = await User.findOne({ email: params.email.toLowerCase() });

        // Si no existe el user
        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        // Comprobar si el password recibido es igual al que está almacenado en la BD
        const validPassword = await bcrypt.compare(params.password, user.password);

        // Si los passwords no coinciden
        if (!validPassword) {
            return res.status(401).json({
            status: "error",
            message: "Contraseña incorrecta"
            });
        }

        // Generar token de autenticación
        const token = createToken(user);

        // Devolver Token generado y los datos del usuario
        return res.status(200).json({
            status: "success",
            message: "Login exitoso",
            token,
            user: {
                id: user._id,
                name: user.name,
                last_name: user.last_name,
                bio: user.bio,
                email: user.email,
                nick: user.nick,
                role: user.role,
                image: user.image,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.log("Error en el login del usuario: ", error);
        return res.status(500).send({
            status: "error",
            message: "Error en el login del usuario"
        });
    }
}


//Metodo para mostrar el perfil del usuario
export const profile = async (req, res) => {
    try {
        //obtener el id del usuario desde los parametros
        const userId = req.params.id;

        //Buscar el usuario en la BD, excluimos contrase;a y rol
        const user = await User.findById(userId).select('-password -role -__v');

        //Verificar si el usuario existe
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Usuario no encontrado"
            })
        }

        //Devolver la informacion del perfil del usuario
        return res.status(200).json({
            status: "succes",
            user
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "error",
            message: "Error al obtener el perfil del usuario"
        });
    }
}


// Método para listar usuarios con paginación
export const listUsers = async (req, res) => {
    try {
      // Controlar en qué página estamos y el número de ítemas por página
      let page = req.params.page ? parseInt(req.params.page, 10) : 1;
      let itemsPerPage = req.query.limit ? parseInt(req.query.limit, 10) : 5;
  
      // Realizar la consulta paginada
      const options = {
        page: page,
        limit: itemsPerPage,
        select: '-password -role -__v'
      };
  
      const users = await User.paginate({}, options);
  
      // Si no hay usuario en la página solicitada
      if (!users || users.docs.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No hay usuarios disponibles"
        });
      }
  
      // Devolver los usuarios paginados
      return res.status(200).json({
        status: "success",
        users: users.docs,
        totalDocs: users.totalDocs,
        totalPages: users.totalPages,
        page: users.page,
        pagingCounter: users.pagingCounter,
        hasPrevPage: users.hasPrevPage,
        hasNextPage: users.hasNextPage,
        prevPage: users.prevPage,
        nextPage: users.nextPage
      });
    } catch (error) {
      console.log("Error al listar los usuarios:", error);
      return res.status(500).send({
        status: "error",
        message: "Error al listar los usuarios"
      });
    }
  }