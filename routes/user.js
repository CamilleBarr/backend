const express = require('express');
const router = express.Router();
//const maxConnectionRequet = require('../middleware/limiter');
const userController = require('../controllers/user');
const email = require ('../middleware/email');
const password = require('../middleware/password');


//route post parce que frontend envoie aussi des info : address mail and passwords

// //---------- réponse retournée par le serveur en MODIFICATION / MAJ /PUT via le fichier controllers
router.post('/signup', email, password, userController.signup);

//---------- réponse retourné par le serveur en MODIFICATION / MAJ /PUT
router.post('/login', userController.login);

module.exports = router;