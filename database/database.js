const Sequelize = require('sequelize');
const connection = new Sequelize('perguntasDb', 'root', 'MyPass1234567', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = connection;
