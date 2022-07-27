const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
//const cryptJs = require('crypto-js'); 

var schemaPassword = new passwordValidator();

// Add properties to it
schemaPassword
    .is().min(8) // Minimum length 8
    .is().max(25) // Maximum length 25
    .has().uppercase(1) // Must have uppercase letters
    .has().lowercase(1) // Must have lowercase letters
    .has().digits(2) // Must have at least 2 digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values



//---------- inscription avec mot de passe sécurisé et class user / async
exports.signup = (req, res, next) => {
    //console.log("req.body", req.body);
    if (emailValidator.validate(req.body.email) != req.body.email) {
        throw "email address invalid"
    } else if (!schemaPassword.validate(req.body.password)) {
        throw "password invalid. Must contain between 8 to 25 characters, capital and lower letters, with 2 numbers at least "
    } else {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({
                        message: "Utilisateur crée et sauvegardé !"
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            })
            .catch(error => res.status(500).json({
                error
            }.send(console.log(error))));
        }
};
//console.log(req.body);

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
                                token: jwt.sign({
                                        userId: user._id
                                    },
                                    process.env.TOKEN_SECRET, {
                                        expiresIn: '24h'
                                    }
                                )
                            });
                        }
                    })
                    console.log("success in signing up : ", true)
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