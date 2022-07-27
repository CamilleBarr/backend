const express = require('express');
const router = express.Router();
//const maxConnectionRequet = require('../middleware/limiter');
const userController = require('../controllers/user');
console.log("userController:", userController);

//route post parce que frontend envoie aussi des info : address mail and passwords

// //---------- réponse retournée par le serveur en MODIFICATION / MAJ /PUT via le fichier controllers
router.post('/signup', userController.signup);

//---------- réponse retourné par le serveur en MODIFICATION / MAJ /PUT
router.post('/login', userController.login);

module.exports = router;