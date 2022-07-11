const express = require('express');
//const app = require('../app');
//const app = require('../app');

const router = express.Router();
const sauceControllers = require('../controllers/sauce');

// //---------- réponse retournée par le serveur en MODIFICATION / MAJ /PUT via le fichier controllers
router.post('/', sauceControllers.createSauce);

//---------- réponse retourné par le serveur en MODIFICATION / MAJ /PUT
router.put('/:id', sauceControllers.updateSauce);


//---------- réponse retourné par le serveur en SUPPRESSION / DESTROY
router.delete('/:id', sauceControllers.deleteSauce);



/*
//------------------------
//Bout de code devenu inutile
app.post((req, res, next) => {
    res.json({
        message: 'Votre requête a bien été reçue, pour la deuxième fois !'
    });
    next();
});

app.post((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});

//-----------------------
*/

//---------- réponse retourné par le serveur en RECUPERATION / GET
router.get('/:id', sauceControllers.getOneSauce);
router.get('/', sauceControllers.getAllSauce); 

module.exports = router;