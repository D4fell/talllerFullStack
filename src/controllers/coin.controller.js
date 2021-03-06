'use strict'

const db = require('../models');
const COIN = db.coin;
const Op = db.Sequelize.Op;
const { braveCoinList, getPriceCoin } = require('../services/braveNewCoin');
const _ = require('lodash')

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

exports.getCoinCode = (req, res) => {

    let codeCoin = req.params.code;

    COIN.findOne({
        where: { code: codeCoin }
    }).then(coin => {

        if (!coin ) { 
            return res.status(400).send({ message: 'No se ha encontrado la moneda que intenta consultar' });
        }

        return res.status(200).send(coin);              

    })
    .catch( error =>{
        res.status(500).send({ message: 'Ha ocurrido un error al momento de consultar una moneda'})
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

exports.populateCoins = async (req, res) => {
    let coinList = await braveCoinList();

    _.map(coinList, async coin =>{
        const coinBrave = {
            code: coin.symbol,
            name: coin.name,
            source: coin.url,
            type: coin.type,
            status: coin.status,
            braveCoinId: coin.id,
            price:await getPriceCoin(coin.id)
        }

        COIN.create(coinBrave)
        .then(coinData => {
            res.status(200).send({ message: 'Se han importado las monedas correctamente' });
        })
        .catch(error => {
            res.status(500).send({message: error || 'Ha ocurrido un error obteniendo la informaci??n de las monedas!.'})
        })
    })
    /*for (const coin of coinList) {
        
        const coinBrave = {
            code: coin.symbol,
            name: coin.name,
            source: coin.url,
            type: coin.type,
            status: coin.status,
            braveCoinId: coin.id,
            price:await getPriceCoin(coin.id)
        }

        console.log(coinBrave,'COIN---BRAVE');
    
        COIN.create(coinBrave)
        .then(coinData => {
            res.status(200).send({ message: 'Se han importado las monedas correctamente' });
        })
        .catch(error => {
            res.status(500).send({message: error.message || 'Ha ocurrido un error creando la moneda!'})
        })
    }*/
}