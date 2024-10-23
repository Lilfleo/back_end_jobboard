const jwt = require("jsonwebtoken");


// Middleware pour vérifier le token d'authentification
const verifyAuthToken = (req, res, next) => {
    console.log(req.headers)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        console.log('Token manquant');
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            console.log('Erreur de vérification du token:', err);
            return res.sendStatus(403);
        }
        req.user = user; // Ajoute l'utilisateur à la requête
        next();
    });
};


// Middleware pour autoriser des rôles spécifiques
const authorizeRole = (allowedRoles) => {
    
    return (req, res, next) => {
        // Vérifie si l'utilisateur a un rôle autorisé
        console.log(req.user)
        const userRole = req.user.role; // Assure-toi que le rôle est présent dans le token
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
};

module.exports = {
    verifyAuthToken,
    authorizeRole,
};
