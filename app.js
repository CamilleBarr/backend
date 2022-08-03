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

// importation de body parser

const bodyParser = require('body-parser');
//--------- j'appelle la fonction express
const app = express();
//---------- ajout de sécurité pour les hearders et les variables

const dotenv = require('dotenv').config();
const helmet = require('helmet');
app.use(helmet());


//---------- connexion à la base de données MongoDB. Ci-dessous = middleware
mongoose
    .connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//permet de gerer les problèmes de CORS quand front et back ne sont pas sur le même serveur

app.use((req, res, next) => {
    res.removeHeader('Cross-Origin-Resource-Policy');
    next();
});

app.use(express.json());
//---------- headers adapté pour les CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site'); 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// transform body req in usable json
app.use(bodyParser.json());


//---------- on enregistre les routes comme ceci :
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, 'images')));

module.exports = app;