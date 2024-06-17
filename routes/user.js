//Importaciones
import { Router} from "express";
import { testUser, register, login, profile, listUsers } from "../controllers/user.js";
import { ensureAuth } from "../middlewares/auth.js"
const router = Router();

//Definir la rutas
router.get('/test-user', ensureAuth, testUser);
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', ensureAuth, profile);
router.get('/list/:page?', ensureAuth, listUsers);

//Exportar el Router
export default router;