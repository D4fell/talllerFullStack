'use strict'

const db = require('../models');
const COIN = db.coin;
const Op = db.Sequelize.Op;

exports.getCoins = (req, res) => {
    
    COIN.findAll()
    .then( coins => {
        if ( !coins || coins.length === 0 ) {
            return res.status(400).send({message: 'No se han encontrado monedas registradas' });
            
        }
        res.status(200).send(coins)
    })
    .catch(error => {
        res.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener la lista de monedas'})
    })
}

exports.createCoin = (req, res) => {
    
    const coin = {
        code: req.body.code,
        price: req.body.price,
        name: req.body.name,
        source: req.body.source,
    }

    COIN.create(coin)
    .then(coinData => {
        res.status(200).send(coinData);
    })
    .catch(error => {
        res.status(500).send({message: error.message || 'Ha ocurrido un error creando la moneda!'})
    })
}