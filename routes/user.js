const express = require('express');
const router = express.Router();
//const maxConnectionRequet = require('../middleware/limiter');
const userControllers = require('../controllers/user');

//route post parce que frontend envoie aussi des info : address mail and passwords

// //---------- réponse retournée par le serveur en MODIFICATION / MAJ /PUT via le fichier controllers
router.post('/signup', userControllers.signup);

//---------- réponse retourné par le serveur en MODIFICATION / MAJ /PUT
router.post('/login', 
//max.limiter,
userControllers.login);

module.exports = router;