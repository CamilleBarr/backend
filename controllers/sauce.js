const Sauce = require('../models/sauce');
const fs = require('fs');
//---------- réponse retourné par le serveur en CREATION / POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl:'${req.protocol}://${req.get("host")}/images/${req.file.filename}'
    });

    sauce.save()
        .then(() => {res.status(201).json({
            message: 'objet enregistré !'
})})
        .catch(error => res.status(400).json({
            error 
        }));

};

exports.updateSauce = ((req, res, next) => {
    sauce.updateOne({
            _id: req.params.id
        }, {
            ...req.body,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Objet modifié !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
});


exports.deleteSauce = ((req, res, next) => {
    sauce.deleteOne({
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Objet supprimé !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
});

exports.getOneSauce = ((req, res, next) => {
    sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({
            error
        }));
});

exports.getAllSauce = ((req, res, next) => {
    sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({
            error
        }));
});