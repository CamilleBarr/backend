const express = require('express');
//const app = require('../app'); optional for piquaante
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceControllers = require('../controllers/sauces');


router.get('/', auth, sauceControllers.getAllSauce); 

// //---------- réponse retournée par le serveur en MODIFICATION / MAJ /PUT via le fichier controllers
router.post('/', auth, multer, sauceControllers.createSauce);


//---------- réponse retourné par le serveur en RECUPERATION / GET
router.get('/:id', auth, sauceControllers.getOneSauce);

//---------- réponse retourné par le serveur en MODIFICATION / MAJ /PUT
router.put('/:id', auth, multer, sauceControllers.updateSauce);

//---------- réponse retourné par le serveur en SUPPRESSION / DESTROY
router.delete('/:id', auth, sauceControllers.deleteSauce);
//---------- réponse retournée par le serveur en LIKANT ou DISLIKE one sauce
//router.post('/:id/like', auth, multer, sauceControllers.likingIcon);


module.exports = router;