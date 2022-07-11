const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//---------- inscription avec mot de passe sécurisé et class user / async
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({
                    message: "Utilisateur crée !"
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};

//---------- connexion à la plateforme avec vérification compte existant et verification password
// avec gestion d'erreur d'exécution de la requete au serveur, err verif mot de passe, err user not exist
exports.login = (req, res, next) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user === null) {
                res.status(401).json({
                    message: "Paire identifiant/mot de passe incorrecte"
                })
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({
                                message: "Paire identifiant/mot de passe incorrecte"
                            })
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId : user._id},
                                    'RANDOM_TOKEN_SECRET',
                                    {expiresIn:'24h'}
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({
                            error
                        });
                    })
            }
        })
        .catch(error => {
            res.status(500).json({
                error
            });
        })
};