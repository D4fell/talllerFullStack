'use strict'

const dataBaseCfg = require('../../config/db.config');
const Sequelize = require('sequelize');
const fs = require('fs')

const sequelize = new Sequelize(dataBaseCfg.DB, dataBaseCfg.USER, dataBaseCfg.PASSWORD, {
    host: dataBaseCfg.HOST,
    dialect: dataBaseCfg.dialect,
    operatorsAliases: false,
  
    pool: {
      max: dataBaseCfg.pool.max,
      min: dataBaseCfg.pool.min,
      acquire: dataBaseCfg.pool.acquire,
      idle: dataBaseCfg.pool.idle
    },
    ssl: true,
    dialectOptions: {
      encrypt: true,
      ssl: {
          ca: fs.readFileSync('./BaltimoreCyberTrustRoot.crt.pem')
      }
  }
  });
  
  const db = {};
  
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  
  db.user = require("./user.model.js")(sequelize, Sequelize);
  db.coin = require("./coin.model.js")(sequelize, Sequelize);
  db.user_coin = require("./user_coin.model.js")(sequelize, Sequelize);

  db.user.belongsToMany(db.coin, {
    through: 'user_coin',
    as: 'coins',
    foreignKey: 'user_id',
  });

  db.coin.belongsToMany(db.user, {
    through: 'user_coin',
    as: 'users',
    foreignKey: 'coins_id',
  })

  module.exports = db;