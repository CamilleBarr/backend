const Sauce = require('../models/Sauce');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require("dotenv").config();

/*const {
    findOne
} = require('../models/Sauce');

const {
    STATUS_CODES
} = require('http');*/
//---------- réponse retourné par le serveur en CREATION / POST

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    //delete sauceObject._userId;
    const newSauce = new Sauce({
        ...sauceObject,
        //userId: req.auth.userId, not necessary since any user can add a sauce to its favorite
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
    // rajouter des conditions.

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : {
        ...req.body
    };
    /*
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
    */
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
    /*
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
                    */
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
                message: "Object supprimé"
            })
        })
        .catch(error => res.status(401).json({
            error
        }));
    //})
    //}
    //})
    /*
            .catch(error => res.status(500).json({
                error
            }));*/
};


exports.checkSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(function (sauce) {
      switch (req.body.like) {
        // Like = 1 => L'utilisateur aime la sauce (like = +1)
        case 1:
          if (
            !sauce.usersLiked.includes(req.body.userId) &&
            req.body.like === 1
          ) {
            // console.log(
            //   "Le 'userId' n'est pas contenu dans 'usersLiked' et le 'userId aime la sauce"
            // );
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne(
              { _id: req.params.id },
              // Utilisation de l'opérateur '$inc' de mongoDB pour l'incrémentation du champ 'like' à '1' dans la base de données
              // Utilisation de l'opérateur '$push' de mongoDB pour l'ajout du 'userId' dans le champ 'usersLiked' dans la base de données
              { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
            )
              .then(function () {
                res
                  .status(201)
                  .json({ message: "La sauce a été likée !" });
              })
              .catch(function (error) {
                res.status(400).json({ error: error });
              });
          }
          break;

        // Like = -1 => L'utilisateur n'aime pas la sauce (dislike = +1)
        case -1:
          if (
            !sauce.usersDisliked.includes(req.body.userId) &&
            req.body.like === -1
          ) {
            // console.log(
            //   "Le 'userId' n'est pas contenu dans 'usersDisliked' et le 'userId' n'aime pas la sauce"
            // );
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne(
              { _id: req.params.id },
              // Utilisation de l'opérateur '$inc' de mongoDB pour l'incrémentation du champ 'dislike' à '1' dans la base de données
              // Utilisation de l'opérateur '$push' de mongoDB pour l'ajout du 'userId' dans le champ 'usersDisliked' dans la base de données
              {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
              }
            )
              .then(function () {
                res
                  .status(201)
                  .json({ message: "La sauce a été dislikée !" });
              })
              .catch(function (error) {
                res.status(400).json({ error: error });
              });
          }
          break;

        case 0:
          // Like = 0  => L'utilisateur annule son like (like = 0)
          // Si le 'userId' est contenu dans 'usersLiked' et que le 'userId' annule son vote
          if (sauce.usersLiked.includes(req.body.userId)) {
            // console.log(
            //   "Le 'userId' est contenu dans la 'userLiked' et le 'userId' annule son vote"
            // );
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne(
              { _id: req.params.id },
              // Utilisation de l'opérateur '$inc' de mongoDB pour la décrémentation du champ 'likes' de '-1' dans la base de données
              // Utilisation de l'opérateur '$pull' de mongoDB pour supprimer le 'userId' dans le champ 'usersLiked' dans la base de données
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
              }
            )
              .then(function () {
                res
                  .status(201)
                  .json({ message: "Le like de la sauce a été annulé !" });
              })
              .catch(function (error) {
                res.status(400).json({ error: error });
              });
          }
          if (sauce.usersDisliked.includes(req.body.userId)) {
            // Like = 0  => L'utilisateur annule son dislike (dislike = 0)
            // Si le 'userId' est contenu dans 'usersDisliked' et que le 'userId' annule son vote
            // console.log(
            //   "Le 'userId' est contenu dans la 'userDisliked' et le 'userId' annule son vote"
            // );
            // Mise à jour de la sauce dans la base de données
            Sauce.updateOne(
              { _id: req.params.id },
              // Utilisation de l'opérateur '$inc' de mongoDB pour la décrémentation du champ 'dislike' à '-1' dans la base de données
              // Utilisation de l'opérateur '$pull' de mongoDB pour supprimer le 'userId' dans le champ 'usersLiked' dans la base de données
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )
              .then(function () {
                res
                  .status(201)
                  .json({ message: "Le dislike de la sauce a été annulé !" });
              })
              .catch(function (error) {
                res.status(400).json({ error: error });
              });
          }
          break;
      }
    })
    .catch(function (error) {
      res.status(404).json({ error: error });
    });
};