const db = require('../../data/dbConfig');

const register = async (user) => {
    const [id] = await db('users').insert(user);
    return findById(id);
};

const login = async (creds) => {

};

module.exports = {
    register,
    login,
};