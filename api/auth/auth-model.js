const db = require('../../data/dbConfig');

const findById = async (id) => {
    const user = await db('users').where('id', id).first();
    return user;
};

const register = async (user) => {
    const [id] = await db('users').insert(user);
    return findById(id);
};

module.exports = {
    register,
};