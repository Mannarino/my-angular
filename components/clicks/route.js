var express = require ('express')
var router = express.Router()
const verifyAccess = require('./../../middelwares/access')
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  createdAt: { type: Date, default: Date.now }
});

const clickSchema = new mongoose.Schema({
  userId: String,
  click: String,
  clickedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Click = mongoose.model('Click', clickSchema);

//crear usuario
router.post('/registeruser', async (req, res) => {
  const { userId } = req.body;
  console.log('llamado el registro de usuario')
  const existingUser = await User.findOne({ userId });
  if (!existingUser) {
    const newUser = new User({ userId });
    await newUser.save();
    res.status(201).send({ message: 'Usuario registrado' });
  } else {
    res.status(200).send({ message: 'Usuario ya existe' });
  }
});

//registrar click
router.post('/', async (req,res)=>{
	 const { userId, click } = req.body;

  const clickMaked = new Click({ userId, click });
  await clickMaked.save();
  res.status(201).send({ message: 'Clic registrado' });
})



// Obtener todos los usuarios con sus clics
router.get('/users', async (req, res) => {
  try {
    // Obtener todos los usuarios
    const users = await User.find({});

    // Para cada usuario, obtener los clics asociados
    const usersWithClicks = await Promise.all(users.map(async (user) => {
      const clicks = await Click.find({ userId: user.userId });
      return { user, clicks };
    }));

    // Enviar la respuesta con todos los usuarios y sus clics
    res.status(200).send(usersWithClicks);
  } catch (error) {
    res.status(500).send({ message: 'Error al recuperar los usuarios y los clics', error });
  }
});



module.exports= router