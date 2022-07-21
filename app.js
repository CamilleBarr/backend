//---------- express pour bodyparser les requetes et responses json - middleware
const express = require('express');
//--------- j'appelle la fonction mongoose
const mongoose = require('mongoose');
//---- inportation des modèles
//--------- j'importe le modèle d'authentification utilisateur
const userRoutes = require('./routes/user');
//--------- j'importe le modèle des sauces
const sauceRoutes = require('./routes/sauces');

const path = require('path');
//--------- j'appelle la fonction express
const app = express();
//---------- ajout de sécurité pour les hearders et les variables
//const helmet = require('helmet'); 
/* const dotenv = require('dotenv').config(); 

app.use(helmet());
*/
//---------- connexion à la base de données MongoDB. Ci-dessous = middleware
mongoose.connect(`mongodb+srv://WebmisstressTest0:WebmisstressTest0@cluster0.ngbkf.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
/* OPTIONAL FOR PIQUAANTE
app.post(express.json());
app.post((req, res) => {
    res.json({
        message: 'Votre requête a bien été reçue !'
    });
});
*/

app.use(express.json());

//---------- headers adapté pour les CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    //res.setHeader('Cross-Origin-Resource-Policy', 'same-site'); ajout securité
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


//---------- on enregistre les routes comme ceci :
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;