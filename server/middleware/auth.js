const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config()
const SECRET = process.env.SECRET;

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500;

        let decodeData;

        if (token && isCustomAuth) {
            decodeData = jwt.verify(token, SECRET);
            req.clientId = decodeData?.id;
        } else {
            decodeData = jwt.decode(token);
            req.clientId = decodeData?.sub;
        }

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = auth;
