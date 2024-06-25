//Importaciones
import { Router } from "express";
const router = Router();
import { register, testUser, login, profile, listUsers, updateUser, uploadFiles, avatar } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js";
import User from "../models/user.js"
import { checkEntityExists } from "../middlewares/checkEntityExists.js"
import multer from "multer";


//Configuracion de subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname)
    }
});

//Middleware (poner en otro archivo y importar para buena practica)
const uploadAvatar = multer({ storage });

//Definir la rutas
router.get('/test-user', ensureAuth, testUser);
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', ensureAuth, profile);
router.get('/list/:page?', ensureAuth, listUsers);
router.put('/update', ensureAuth, updateUser);
router.post('/upload', [ensureAuth, checkEntityExists(User, 'user_id'), uploadAvatar.single("file0")], uploadFiles);
router.get('/avatar/:file', ensureAuth, avatar);

//Exportar el Router
export default router;