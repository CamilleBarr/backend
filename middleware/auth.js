const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw "Log into Piquaante to start sharing spicy sauces"
        }
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid user"
        } else {
            next()
        }
    } catch (error) {
        res.status(403).json({
            message :"Unauthorized request"
        });
    }
};