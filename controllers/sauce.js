const sauceControllers = require('../models/sauce');

//---------- réponse retourné par le serveur en CREATION / POST
exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new sauce({
        ...req.body
    });
    sauce.save()
        .then(res.status(201).json({
            message: 'object enregistré'
        }))
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