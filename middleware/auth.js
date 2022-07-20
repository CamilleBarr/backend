const jwt = require('jsonwebtoken');
//const dotenv = require('dotenv').config();
module.exports = (req, res, next) => {
    //ajout de condition qui vérifie la connexion
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId:userId
        };
    } catch (error) {
        res.status(403).json({
            message :"Unauthorized request"
        });
    }
}