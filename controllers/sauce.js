const sauceControllers = require('../models/sauce');

//---------- réponse retourné par le serveur en CREATION / POST
exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({

        ...req.body
    });
    sauce.save()
        .then(res.status(201).json({
            message: 'object enregistré'
        }))
        .catch(error => res.status(400).json({
            errror
        }));
    /*
    console.log(req.body);
    res.status(201), json({
        message: 'objet crée)'
    });*/
};

exports.updateSauce = ((req, res, next) => {
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
    Sauce.deleteOne({
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
    Sauce.findOne({
            _id: req.params.id
        })
        /*
        const stuff = [{
                _id: 'oeihfzeoi',
                title: 'Mon premier objet',
                description: 'Les infos de mon premier objet',
                imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
                price: 4900,
                userId: 'qsomihvqios',
            },
            {
                _id: 'oeihfzeomoihi',
                title: 'Mon deuxième objet',
                description: 'Les infos de mon deuxième objet',
                imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
                price: 2900,
                userId: 'qsomihvqios',
            },
        ];
        res.status(200).json(stuff);
        */
        .then(Sauces => res.status(200).json(Sauces))
        .catch(error => res.status(400).json({
            error
        }));
});

exports.getAllSauce = ((req, res, next) => {
    Sauce.find()
        .then(Sauces => res.status(200).json(Sauces))
        .catch(error => res.status(400).json({
            error
        }));
});