'use strict'

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          sizeValidator(value) {
            if (value.length < 2 || value.length > 50) {
              throw new Error('El campo firstName debe estar en el rango entre 2 y 50 caracteres');
            }
          }
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          sizeValidator(value) {
            if (value.length < 2 || value.length > 50) {
              throw new Error('El campo firstName debe estar en el rango entre 2 y 50 caracteres');
            }
          }
        }
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          userNameValidator(value) {
            if (value.length < 2 || value.length > 15) {
              throw new Error('El campo userName debe estar en el rango entre 2 y 15 caracteres');
            }
          }
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      preferedCoin: {
        type: Sequelize.STRING
      }
    });
    return User;
  };