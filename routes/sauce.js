const express = require('express');
//const app = require('../app');

const auth = require('../middleware/auth');
const router = express.Router();

const sauceControllers = require('../controllers/sauce');

// //---------- réponse retournée par le serveur en MODIFICATION / MAJ /PUT via le fichier controllers
router.post('/', auth, sauceControllers.createSauce);

//---------- réponse retourné par le serveur en MODIFICATION / MAJ /PUT
router.put('/:id',auth, sauceControllers.updateSauce);

//---------- réponse retourné par le serveur en SUPPRESSION / DESTROY
router.delete('/:id',auth, sauceControllers.deleteSauce);

//---------- réponse retourné par le serveur en RECUPERATION / GET
router.get('/:id', auth, sauceControllers.getOneSauce);
router.get('/', auth, sauceControllers.getAllSauce); 

module.exports = router;