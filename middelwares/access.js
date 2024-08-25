var express = require ('express')
const obtenerValoresDeEntorno = require('./../environment/getEnvironment.js')
const config =obtenerValoresDeEntorno()
const jwt = require('jsonwebtoken');
//solo verifica que sea un token valido


// Clave secreta para verificar el token


function verifyToken(req, res, next) {
  // Obtener la cookie firmada que contiene el token
  const token = req.signedCookies.authToken;

  // Verificar si la cookie existe
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, config.KEY_SECRET_TOKEN);
    // Adjuntar el usuario decodificado al objeto req
    req.user = decoded;
    next(); // Continuar con el siguiente middleware o ruta
  } catch (err) {
    // Si el token no es válido o ha expirado
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;


