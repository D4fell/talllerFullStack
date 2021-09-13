'use strict'

module.exports = (sequelize, Sequelize) => {
    const Coin = sequelize.define("coin", {
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isAlpha: {
            msg: 'El campo code solo permite letras'
          },
          sizeValidator(value) {
            if (value.length < 2 || value.length > 10) {
              throw new Error('El campo code debe estar en el rango entre 2 y 10 caracteres');
            }
          }
        }
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        notEmpty: true,
        validate: {
          isNumeric: {
            msg: 'El campo price solo permite números'
          }
        }
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
      }
    });
  
    return Coin;
  };