'use strict'

module.exports = {
    HOST: 'talllerdb.mysql.database.azure.com',
    USER: 'tallerdb@talllerdb',
    PASSWORD: '123456789Abc',
    DB: 'tallerDB',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };