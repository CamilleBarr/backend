const passwordValidator = require("password-validator"); // Importation du package 'password-validator'

// Création du schéma
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

// EXPORTS
// VERIFICATION DU MOT DE PASSE : Middleware de vérification de la qualité du mot de passe par rapport au schéma
module.exports = function (req, res, next) {
  // Si le mot de passe n'est pas validé
  if (!passwordSchema.validate(req.body.password)) {
    return res.status(400).json({
      message:
        "Le mot de passe doit contenir entre 8 et 15 caractères, avec au moins une majuscule et un chiffre !",
    });
  } else {
    next();
  }
};