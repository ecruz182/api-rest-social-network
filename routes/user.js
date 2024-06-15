//Importaciones
import { Router} from "express";
import { testUser, register } from "../controllers/user.js";
const router = Router();

//Definir la rutas
router.get('/test-user', testUser);
router.post('/register', register);

//Exportar el Router
export default router;