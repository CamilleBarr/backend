const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
//let emailValidator = require('email-validator');
//const regex = ('^[a-zA-Z.-_]{3,30}[@]{1}[a-zA-Z.-_]{3,30}[.]{1}[a-z]{2}[^0-9]$');
//const passwordValidator = require('password-validator');

//const cryptJs = require('crypto-js'); 



//---------- inscription avec mot de passe sécurisé et class user / async
exports.signup = (req, res, next) => {
    
console.log("email signing up : ", req.body.email);
console.log("pwd in signing up: ", req.body.password);
   /*
    if (emailValidator.validate(req.body.email) = (req.body.email)) {
        throw "email address invalid"
        
    } else 
    if (schemaPassword.validate((req.body.password) != (req.body.password))) {
        return "password invalid. Must contain between 8 to 25 characters, capital and lower letters, with 2 numbers at least "
    } else {*/
        
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
            }
            //.send(console.log(error))
            ));
            
        //}
};

//---------- connexion à la plateforme avec vérification compte existant et verification password
// avec gestion d'erreur d'exécution de la requete au serveur, err verif mot de passe, err user not exist
exports.login = (req, res, next) => {
    
console.log("email loging up : ", req.body.email);
console.log("pwd in loging up: ", req.body.password);
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
                                    process.env.TOKEN_SECRET,{ 
                                        expiresIn: '24h'
                                    }
                                )
                            });
                        }
                    })
                    
                    .catch(error => {
                        console.log ("hash crypt compare has fail with :", error.message);
                        res.status(500).json({
                            error
                        });
                    })
            }
        })
        .catch(error => {
            console.log ("mongoDB fetch  has fail with :", error.message);
            res.status(500).json({
                error
            })
        });
        
};
