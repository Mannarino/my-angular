const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const routes = require('./routes.js')
const obtenerValoresDeEntorno = require('./environment/getEnvironment.js')
const config =obtenerValoresDeEntorno()
const DBconection = require('./db.js')
const cookieParser = require('cookie-parser');
const verifyToken = require('./middelwares/access.js');

// Configurar CORS para permitir solicitudes desde el dominio específico
app.use(cors({
  origin: 'https://moises-mannarino.netlify.app', // Especifica el dominio permitido
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  credentials: true // Permite el envío de cookies y encabezados de autenticación
}));
app.use(cookieParser('mi_secreto'));






app.use(express.json());
//ruteo

//conection base datos
DBconection()


routes(app)




// Función para generar un token JWT
function generateToken(username) {
  return jwt.sign({ username },config.KEY_SECRET_TOKEN , { expiresIn: '1h' });
}

// Endpoint para verificar usuario y contraseña
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario es "moises" y la contraseña es correcta
  if (username === 'moises' && password === config.ADMIN_PASSWORD) {
    // Generar un token
    const token = generateToken(username);

    // Enviar el token en la respuesta
    res.status(200).json({
      message: 'Login exitoso',
      token: token
    });
  } else {
    // Responder con error si el usuario o contraseña son incorrectos
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }
});https://moises-mannarino.netlify.app/sitio/about-me

//server escuchando
app.listen(process.env.PORT || 3000,()=>{
	console.log('programa almacen andando en el puerto '+ (process.env.PORT || 3000))
})