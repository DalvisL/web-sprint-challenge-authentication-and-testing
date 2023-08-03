const db = require('../../data/dbConfig');

const checkUsernameExists = async (req, res, next) => {
    try {
        if(!req.body.username) {
            next()
        }
        const existing = await db('users').where('username', req.body.username).first();
        if (existing) {
            res.status(401).json({ message: 'username taken', existing: existing });
        } else {
            next();
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    checkUsernameExists,
}