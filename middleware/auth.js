const jwt = require('jsonwebtoken');
//const dotenv = require('dotenv').config();
module.exports = ((req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.SECRET_TOKEN}`);
        const userId = decodedToken.userId;
        req.auth = {
            userId:userId
        };
    } catch (error) {
        res.status(403).json({
            message :"Unauthorized request"
        });
    }
});