const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const database = require('../services/db');

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Vérifiez les champs requis
    if (!firstName || !lastName || !email || !password) {
        return res.status(422).json({ error: 'All fields are required' });
    }
    // verifie le format de l'email
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Récupérer l'id du rôle & met  le role 'user' par défaut si rien n'est selectionner
    const userRole = 'user';

    const { rows: roleData } = await database.pool.query(
        'SELECT id FROM roles WHERE role_name = $1',
        [userRole]
    );

    if (roleData.length === 0) {
        return res.status(422).json({ error: 'Invalid role provided' });
    }

    const assignedRoleId = roleData[0].id;
    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const { rows } = await database.pool.query(
            'INSERT INTO users (first_name, last_name, email, password, id_role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstName, lastName, email, hashedPassword, assignedRoleId]
        );

        // Création du token JWT avec l'email et le rôle
        const accessToken = jwt.sign(
            { email: rows[0].email, roleId: rows[0].id_role }, // Le rôle dans le token
            process.env.SECRET
        );

        res.status(201).json({ auth: true, token: `Bearer ${accessToken}`, user: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const { rows } = await database.pool.query(
        "SELECT users.id , users.email, users.password, users.first_name, users.last_name,roles.role_name FROM users JOIN roles on users.id_role = roles.id WHERE email = $1",
        [email]
    );

    if (rows.length === 0) {
        return res.status(404).json({ auth: false, reason: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, rows[0].password);

    if (!passwordIsValid) {
        return res.status(401).json({ auth: false, accessToken: null, reason: "Invalid Credentials" });
    }

    const accessToken = jwt.sign(
        {
            email: rows[0].email,
            role: rows[0].role_name
        },
        process.env.SECRET
    );

    res.status(200).json({
        auth: true,
        message: "Logged in successfully",
        token: `Bearer ${accessToken}`,
        user: rows[0]
    });
};

const verifyAuthToken = async (req, res, next) => {
    console.log(req.headers)
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        next();
    });
};
const logout = (req, res) => {

    res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
    register,
    login,
    logout: [verifyAuthToken, logout]
};





