//Importaciones
import { Router} from "express";
import { testPublications } from "../controllers/publications.js";
const router = Router();

//Definir la rutas
router.get('/test-publications', testPublications);

//Exportar el Router
export default router;