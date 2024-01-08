const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secretKey = crypto.randomBytes(32).toString('hex')  //symmetric key for token (length: 32 byte)

function verifyToken(req, res, next) {
    console.log("verifyToken");
    if (!req.header("Authorization")) {
        res.status(401).json({ success: false, error: "Not logged in" });
    }

    const token = req.header("Authorization").split(" ")[1];

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err);
            res.status(401).json({ success: false, error: "Token not verified" });
        } else {
            res.locals.decodedJwt = decoded;
            next();
        }
    });
}

module.exports = { secretKey, verifyToken };
