const db = require('../../data/dbConfig');

// helper function for the register function
const findById = async (id) => {
    const user = await db('users').where('id', id).first();
    return user;
};

const register = async (user) => {
    const [id] = await db('users').insert(user);
    return findById(id);
};

const findByUsername = async (username) => {
    const user = await db('users').where('username', username)
    return user;
};

module.exports = {
    register,
    findByUsername,
};