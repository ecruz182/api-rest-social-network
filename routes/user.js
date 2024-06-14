//Importaciones
import { Router} from "express";
import { testUser } from "../controllers/user.js";
const router = Router();

//Definir la rutas
router.get('/test-user', testUser);

//Exportar el Router
export default router;