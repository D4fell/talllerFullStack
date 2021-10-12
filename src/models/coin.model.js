'use strict'

module.exports = (sequelize, Sequelize) => {
    const Coin = sequelize.define("coin", {
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          sizeValidator(value) {
            if (value.length < 1 || value.length > 10) {
              throw new Error('El campo code debe estar en el rango entre 1 y 10 caracteres');
            }
          }
        }
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        notEmpty: true
      },
      name: {
        type: Sequelize.STRING,
        validate: {
          sizeValidator(value) {
            if (value.length < 2 || value.length > 25) {
              throw new Error('El campo code debe estar en el rango entre 2 y 25 caracteres');
            }
          }
        }
      },
      source: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      braveCoinId: {
        type: Sequelize.STRING
      }
    });
  
    return Coin;
  };