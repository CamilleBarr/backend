const Sauce = require('../models/sauce');
const fs = require('fs');
//const jwt = require('jsonwebtokken');
//do we have to require app ?
//const dotenv = require('dotenv').config();
//---------- réponse retourné par le serveur en CREATION / POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.Sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const Sauce = new Sauce({
        ...sauceObject,
        //userId: req.auth.userId, not necessary since any user can add a sauce to its favorite
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });

    Sauce.save()
        .then(() => {
            res.status(201).json({
                message: 'objet enregistré !'
            })
        })
        .catch(error => res.status(400).json({
            error
        }));

};

exports.updateSauce = ((req, res, next) => {
    // rajouter des conditions.
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.Sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {
        ...req.body
    };

    delete sauceObject._userId;
    Sauce.findOne({
            _id: req.params.id
        })
        .then((Sauce) => {
            if (Sauce.userId != req.auth.userId) {
                res.status(400).json({
                    message: "Non-autorisé"
                });
            } else {
                Sauce.updateOne({
                        _id: req.params.id
                    }, {
                        ...sauceObject,
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: "Object modifié"
                    }))
                    .catch((error => res.status(401).json({
                        error
                    })));
            }
        })
        .catch((error) => {
            res.status(400).json({
                error
            });
        })


    Sauce.updateOne({
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
            Sauce.findOne({
                    _id: req.params.id
                })
                .then(Sauce => {
                        if (Sauce.userId != req.auth.userId) {
                            res.status(401).json({
                                message: 'non-autorisé'
                            })
                        } else {
                            const filename = Sauce.imageUrl.split('/images/')[1];
                            fs.unlink(`images/${filename}`, () => {
                                Sauce.deleteOne({
                                        _id: req.params.id
                                    })
                                    .then(() => {
                                        res.status(200).json({
                                            message:"Object supprimé"
                                        })
                                    })
                                    .catch(error => res.status(401).json({error}));
                            })

                        }
                    })

                .catch(error => res.status(500).json({
                    error
                }));
            });

        exports.getOneSauce = ((req, res, next) => {
            Sauce.findOne({
                    _id: req.params.id
                })
                .then(Sauce => res.status(200).json(Sauce))
                .catch(error => res.status(400).json({
                    error
                }));
        });

        exports.getAllSauce = ((req, res, next) => {
            Sauce.find()
                .then(Sauce => res.status(200).json(Sauce))
                .catch(error => res.status(400).json({
                    error
                }));
        });

        //rajouter pour dislike and like