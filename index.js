const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const MongoStore = require('connect-mongo');
const obtenerValoresDeEntorno = require('./environment/getEnvironment.js')
const config =obtenerValoresDeEntorno()
const session = require('express-session');
const cookieParser = require('cookie-parser');
const verifyToken = require('./middelwares/access.js');
app.use(cookieParser('SECRET_KEY'));


app.use(session({
  store:  MongoStore.create({
    mongoUrl: `mongodb+srv://${config.USER_DATABASE}:${config.PASSWORD_DATABASE}@irina.rnbys.mongodb.net/${config.NAME_DATABASE}?retryWrites=true&w=majority`,
    collectionName: 'sessions', // El nombre de la colección en MongoDB
    ttl: 14 * 24 * 60 * 60, // Tiempo de vida de la sesión (14 días por defecto)
  }),  
  secret: 'mi_secreto', // Una cadena secreta para firmar la cookie de la sesión
  resave: false,        // No guardar la sesión en el almacenamiento si no se modifica
  saveUninitialized: false, // Guardar una sesión nueva pero no modificada
  cookie: { secure: false ,maxAge: 1000 * 60 * 60 * 24 * 14 } // Solo enviar cookies a través de conexiones HTTPS si es true
}));

app.use(express.json());
app.use(cors({ origin: 'https://moises-mannarino.netlify.app', credentials: true }))










// Endpoint para registrar los clics
app.post('/clicks', (req, res) => {
  const click = req.body.click;

  // Inicializar el objeto de clics si no existe
  if (!req.session.clicks) {
    req.session.clicks = {};
  }

  // Verificar si el clic ya está registrado
  if (req.session.clicks[click]) {
    req.session.clicks[click].count++;
  } else {
    // Si no, inicializar el contador y la lista de timestamps para el clic
    req.session.clicks[click] = { count: 1, timestamps: [new Date().toLocaleString()] };
  }

  // Enviar una respuesta con el estado actual de los clics
  // Responder con éxito
    res.status(200).json({ message: 'Login exitoso' });
});


       

app.get('/', (req, res) => {
  // Inicializar el array de fechas si no existe
  if (!req.session.visits) {
    req.session.visits = [];
  }

  // Agregar la fecha actual al array de visitas
  const currentDate = new Date();
  req.session.visits.push(currentDate);

  // Contar la cantidad de visitas
  const visitCount = req.session.visits.length;

  // Enviar la respuesta al usuario
  // Responder con éxito
    res.status(200).json({ message: 'Login exitoso' });
});

// Endpoint para registrar los datos del usuario en la sesión
app.post('/register-user', (req, res) => {
  const { country, city, region } = req.body;
  
  // Guarda los datos en la sesión del usuario
  req.session.userData = {
    country: country || 'Unknown',
    city: city || 'Unknown',
    region: region || 'Unknown'
  };

   // Responder con éxito
    res.status(200).json({ message: 'Login exitoso' });
});

app.get('/session-info',verifyToken,  (req, res) => {
  // Combinar todos los datos almacenados en la sesión
  const sessionData = {
    userData: req.session.userData || {},
    visits: req.session.visits || [],
    clicks: req.session.clicks || {}
  };

  // Enviar la información de la sesión al cliente
  res.json({
    success: true,
    data: sessionData
  });
});


// Función para generar un token JWT
function generateToken(username) {
  return jwt.sign({ username },config.KEY_SECRET_TOKEN , { expiresIn: '1h' });
}

// Endpoint para verificar usuario y contraseña
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verificar si el usuario es "moises" y la contraseña es "11111123"
  if (username === 'moises' && password === '11111123') {
    // Generar un token
    const token = generateToken(username);

    // Configurar la cookie firmada con el token
    res.cookie('authToken', token, {
      httpOnly: true,  // La cookie no puede ser accedida por JavaScript del lado del cliente
      signed: true,    // Firmar la cookie para mayor seguridad
      maxAge: 60 * 60 * 1000 // Expira en 1 hora
    });

    // Responder con éxito
    res.status(200).json({ message: 'Login exitoso' });
  } else {
    // Responder con error si el usuario o contraseña son incorrectos
    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }
});

//server escuchando
app.listen(process.env.PORT || 3000,()=>{
	console.log('programa almacen andando en el puerto '+ (process.env.PORT || 3000))
})