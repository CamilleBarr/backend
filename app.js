//---------- express pour bodyparser les requetes et responses json - middleware
const express = require('express');
//--------- j'appelle la fonction express
const app = express();
//--------- j'appelle l'extension mongoose
const mongoose = require('mongoose');
//--------- j'appelle le fichier des sauces
const Sauces = require('./models/sauce.js');

//---------- connexion à la base de données MongoDB - middleware
mongoose.connect('mongodb+srv://WebmisstressTest0:WebmisstressTest0@cluster0.ngbkf.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.post(express.json());
app.post((req, res) => {
    res.json({
        message: 'Votre requête a bien été reçue pour la seconde fois !'
    });
});

//---------- headers adapté pour les CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//---------- réponse retournée par le serveur en CREATION / POST
app.post('/api/Sauces', (req, res, next) => {
    const sauce = new Sauces({

        ...req.body
    })
    sauce.save()
        .then(res.status(201).json({
            message: 'object enregistré'
        }))
        .catch(error => res.status(400).json({
            errror
        }));
    /*
    console.log(req.body);
    res.status(201), json({
        message: 'objet crée)'
    });*/
});

//------------------------
//Bout de code devenu inutile ?
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


//---------- réponse retourné par le serveur en RECUPERATION / GET
app.get('/api/Sauces', (req, res, next) => {
    const stuff = [{
            _id: 'oeihfzeoi',
            title: 'Mon premier objet',
            description: 'Les infos de mon premier objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userId: 'qsomihvqios',
        },
        {
            _id: 'oeihfzeomoihi',
            title: 'Mon deuxième objet',
            description: 'Les infos de mon deuxième objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userId: 'qsomihvqios',
        },
    ];
    res.status(200).json(stuff);
});




module.exports = app;