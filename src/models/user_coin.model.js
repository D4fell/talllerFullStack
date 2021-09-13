'use strict'

module.exports = (sequelize, Sequelize) => {
    const UserCoin = sequelize.define("userCoin", {
      userID: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      coinID: {
        type: Sequelize.UUID,
        allowNull: false,
      }
    });
    return UserCoin;
  };