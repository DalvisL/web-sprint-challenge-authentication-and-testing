const db = require('../../data/db-config');

const checkUsernameExists = async (req, res, next) => {
    try {
        const existing = await db('users').where('username', req.body.username).first();
        if (!existing) {
            next({ status: 401, message: 'invalid credentials' });
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
}

const validateReqBody = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            next({ status: 401, message: 'username and password required' });
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    checkUsernameExists,
    validateReqBody,
}