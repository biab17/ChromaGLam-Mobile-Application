const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Header:", authHeader); 

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT error:", err.message);
        res.status(401).json({ error: 'Sesion expired.' });
    }
};