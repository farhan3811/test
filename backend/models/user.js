const db = require('../db');

const User = {
  async findByEmail(email) {
    return db('users').where({ email }).first();
  },

  async create(id, email, hashedPassword) {
    await db('users').insert({
      id,
      email,
      password: hashedPassword
    });
    return { id, email };
  }
};

module.exports = User;
