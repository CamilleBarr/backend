const Sauce = require('../models/Sauce');
const fs = require('fs');
const jwt = require('jsonwebtoken');
/*const {
    findOne
} = require('../models/Sauce');

const {
    STATUS_CODES
} = require('http');*/
//---------- réponse retourné par le serveur en CREATION / POST

exports.createSauce = (req, res, next) => {
    console.log("console log create sauce req :", req.body.Sauce);
    const sauceObject = JSON.parse(req.body.Sauce);
    delete sauceObject._id;
    //delete sauceObject._userId;
    const Sauce = new Sauce({
        ...sauceObject,
        //userId: req.auth.userId, not necessary since any user can add a sauce to its favorite
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [" "],
        usersDisliked: [" "],

    });

    Sauce.save()
        .then(() => {
            res.status(201).json({
                message: 'sauce enregistrée !'
            })
        })
        .catch(error => res.status(400).json({
            error
        }));

};

exports.updateSauce = (req, res, next) => {
    // rajouter des conditions.

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.Sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {
        ...req.body
    };

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
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(Sauce => res.status(200).json(Sauce))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(Sauce => res.status(200).json(Sauce))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.deleteSauce = (req, res, next) => {
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
                                message: "Object supprimé"
                            })
                        })
                        .catch(error => res.status(401).json({
                            error
                        }));
                })
            }
        })

        .catch(error => res.status(500).json({
            error
        }));
};


exports.checkSauce = (req, res, next) => {
    const like = req.body.like;
    const dislike = req.body.dislike;
    const usersLiked = req.body.usersLiked;
    const usersDisliked = req.body.usersDisliked;
    const userId = req.body.userId;
    const sauceObject = JSON.parse(req.body.Sauce);
    // on one sauce
    Sauce.findOne({
            _id: req.params.id
        })
        .then(Sauce => {
            // check if the user has already liked or disliked the sauce
            let userLike = Sauce.usersLiked.find((id) => id === userId);
            let userDislike = Sauce.usersDisliked.find((id) => id === userId);
            switch (like) {
                case 1: {
                    if (!userLike && !userDislike) {
                        {
                            Sauce.likes += 1
                            Sauce.userLiked.push(userId)
                            Sauce.save()
                                .then(() => res.status(201).json({
                                    message: 'La sauce est ajoutée à vos favoris'
                                }))
                                .catch((error) => res.status(400).json({
                                    error
                                }));
                        }
                    }

                    if (userLike) {
                        res.status(201).json({
                            message: "Cette sauce est déjà dans vos favoris"
                        })
                    }
                }
                break;

            case 0: {
                if (userLike && !userDislike) {
                    {
                        Sauce.likes -= 1
                        Sauce.userLiked.pop(userId)
                        Sauce.save()
                            .then(() => res.status(201).json({
                                message: 'La sauce est retirée de vos favoris'
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    }
                }
                if (!userLike && userDislike) {
                    {
                        Sauce.dislikes -= 1
                        Sauce.userDisliked.pop(userId)
                        Sauce.save()
                            .then(() => res.status(201).json({
                                message: 'La sauce ne fait plus partie de votre liste noire'
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    }
                }
            }
            break;
            case -1: {
                if (!userLike && !userDislike) {
                    {
                        Sauce.dislikes += 1
                        Sauce.userDisliked.push(userId)
                        Sauce.save()
                            .then(() => res.status(201).json({
                                message: "La sauce n'est pas votre favorite"
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    }
                }
                if (userDislike) {
                    res.status(201).json({
                        message: "Cette sauce a déjà été défavorisée"
                    })
                }
            }

            }
        })
        .catch(error => res.status(500).json({
            error
        }));
}