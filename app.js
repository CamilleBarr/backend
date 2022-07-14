//---------- express pour bodyparser les requetes et responses json - middleware
const express = require('express');
//--------- j'appelle la fonction mongoose
const mongoose = require('mongoose');
//---- inportation des modèles
//--------- j'importe le modèle des sauces
const sauceRoutes = require('./routes/sauce');
//--------- j'importe le modèle d'authentification utilisateur
const userRoutes = require('./routes/user');

//--------- j'appelle la fonction express
const app = express();
//---------- connexion à la base de données MongoDB. Ci-dessous = middleware
mongoose.connect('mongodb+srv://WebmisstressTest0:WebmisstressTest0@cluster0.ngbkf.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.post(express.json());
app.post((req, res) => {
    res.json({
        message: 'Votre requête a bien été reçue !'
    });
});

app.use(express.json());

//---------- headers adapté pour les CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//---------- on enregistre les routes comme ceci :
app.use('/api/sauce', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;