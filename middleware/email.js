const validator = require("email-validator"); // Importation du package 'validator'

// EXPORTS
// VERIFICATION DE L'ADRESSE MAIL : Middleware de vérification de l'adresse mail
module.exports = (req, res, next) => {
    
console.log("test" );
  // Si l'adresse mail n'est pas valide
  if (!validator.isEmail(req.body.email)) {
    console.log("test 2");
    return res
      .status(400)
      .json({ message: "Veuillez saisir une adresse mail valide !" });
  } else {
    next();
  }
};