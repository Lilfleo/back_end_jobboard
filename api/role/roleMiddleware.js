const { verifyAuthToken, authorizeRole } = require('../role/roleController');

const checkRole = (roles) => {
    return [verifyAuthToken, authorizeRole(roles)];
};

module.exports = { checkRole };
