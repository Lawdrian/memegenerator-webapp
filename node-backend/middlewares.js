const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secretKey = crypto.randomBytes(32).toString('hex');

function verifyToken(req, res, next) {
    console.log("trying to verify token");
    if (!req.header("Authorization")) {
        return res.status(401).json({ success: false, error: "Not logged in" });
    }

    const token = req.header("Authorization").split(" ")[1];

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err);
            return res.status(401).json({ success: false, error: "Token not verified" });
        } else {
            res.locals.decodedJwt = decoded;
            next();
        }
    });
}

module.exports = { secretKey, verifyToken };
