'use strict'

const { coin } = require('../models');
const db = require('../models');
const USER = db.user;
const COIN = db.coin;

let verifyUserName = async (req, res, next) => {
    USER.findOne({
        where: {
            userName: req.body.userName
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
            message: 'El usuario que está intentando registrar ya existe!'
        });
        return;
        }
        next();
    });
}

let verifyCoinCode = async (req, res, next) => {
    COIN.findOne({
        where: {
            code: req.body.code
        }
    }).then(coin => {
        if (coin) {
            res.status(400).send({
            message: 'El código de la moneda que está intentando registrar ya existe!'
        });
        return;
        }
        next();
    });
}

module.exports = {
    verifyUserName:verifyUserName,
    verifyCoinCode:verifyCoinCode
};
