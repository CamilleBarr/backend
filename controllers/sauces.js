const Sauce = require('../models/Sauce');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require("dotenv").config();

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    //delete sauceObject._userId;
    const newSauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [" "],
        usersDisliked: [" "],
    });

    newSauce.save()
        .then(() => {
            res.status(201).json({
                message: "sauce enregistrée !"
            })
        })
        .catch(error => res.status(400).json({
            error
        }));
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(402).json({
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
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    Sauce.deleteOne({
            _id: req.params.id
        })
        .then(() => {
            res.status(200).json({
                message: "Produit supprimé"
            })
        })
        .catch(error => res.status(401).json({
            error
        }));
};


exports.checkSauce = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId;

    Sauce.findOne({
            _id: req.params.id
        })
        .then(function (sauce) {
            switch (like) {
                case 1:
                    if (
                        !sauce.usersLiked.includes(userId) && like === 1
                    ) {
                        Sauce.updateOne({
                                    _id: req.params.id
                                },
                                {
                                    $inc: {likes: 1
                                    },
                                    $push: {usersLiked: userId
                                    }
                                }
                            )
                            .then(function () {
                                res.status(201).json({
                                        message: "Cette sauce est favorisée!"
                                    });
                            })
                            .catch(function (error) {
                                res.status(400).json({
                                    error: error
                                });
                            });
                    }
                    break;
                case -1:
                    if (
                        !sauce.usersDisliked.includes(userId) && like === -1
                    ) {
                        Sauce.updateOne({
                            _id: req.params.id
                        },
                        {
                            $inc: {dislikes: 1
                            },
                            $push: {usersDisliked: userId
                            }
                        }
                    )
                            .then(() => res.status(201).json({
                                message: 'La sauce est ajoutée à vos favoris'
                            }))
                            .catch((error) => res.status(400).json({
                                error
                            }));
                    }
                    break;

                case 0:
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({
                                    _id: req.params.id
                                },
                                {
                                    $inc: {likes: -1
                                    },
                                    $pull: {usersLiked: userId
                                    },
                                }
                            )
                            .then(function () {
                                res.status(201).json({
                                        message: "Cette sauce n'est plus favorisée"
                                    });
                            })
                            .catch(function (error) {
                                res.status(400).json({
                                    error: error
                                });
                            });
                    }
                    if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne({
                                    _id: req.params.id
                                },
                                {
                                    $inc: {dislikes: -1
                                    },
                                    $pull: {usersDisliked: userId
                                    },
                                }
                            )
                            .then(function () {
                                res.status(201).json({
                                        message: "La sauce n'est plus défavorisée"
                                    });
                            })
                            .catch(function (error) {
                                res.status(400).json({
                                    error: error
                                });
                            });
                    }
                    break;
            }
        })
        .catch(function (error) {
            res.status(404).json({
                error: error
            });
        });
};