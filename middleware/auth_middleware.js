const admin = require('../config/firebase-config')

async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ msg: "Invalid or missing token" });
        }

        const token = authHeader.split(" ")[1];

        console.log("Extracted Token:", token);

        const decodedToken = await admin.auth().verifyIdToken(token);

        if (decodedToken) {
            console.log("Decoded Token:", decodedToken);
            req.user = decodedToken; 
            return next();
        } else {
            return res.status(401).json({ msg: "Unauthorized" });
        }
    } catch (e) {
        console.error("Token verification error:", e);
        return res.status(500).json({ msg: "Token auth error", error: e });
    }
}

module.exports = {
    authenticateToken
}