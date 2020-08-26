'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/config');
const db = {};

console.log(config);

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
  dialect: config.db.dialect,
  host: config.db.host
});


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const models = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[models.name] = models;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch ((error) => {
        console.error('Unable to connect to the database:', error);
    })
module.exports = db;
