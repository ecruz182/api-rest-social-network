//Importaciones
import connection from "./database/connection.js";
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import UserRoutes from './routes/user.js';
import FollowRoutes from './routes/follow.js';
import PublicationsRoutes from './routes/publications.js'

//Mensaje de bienvenida
console.log("API NODE arriba")

//Conexion a la BD
connection();

//crear servidor node
const app = express();
const puerto = 3900;

//Configurar cors: permite que la speticiones se hagan correctamente
app.use(cors());

//Conversion de datos(body a objetos JS)
app.use(json());
app.use(urlencoded({extended: true}));

//Configurar rutas
app.use('/api/user', UserRoutes);
app.use('/api/follow', FollowRoutes);
app.use('/api/publications', PublicationsRoutes);

app.get('/test-route', (req, res)=> {
    return res.status(200).json(
      {
        'id': 1,
        'name': 'Inés María',
        'username': 'inesmaoria'
      }
    );
  })

//Configurar el servidor para escuchar las peticiones
app.listen(puerto, () => {
    console.log("Servidor de NODE corriendo en el puerto", puerto)
  });