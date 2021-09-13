'use strict'

const config = require('../../config/auth.config');
const service = require('../services');
const { priceQuote } = require ('../utils/priceQuotation');
const db = require('../models');
const USER = db.user;
const COIN = db.coin;
const USERCOIN = db.user_coin;
const Op = db.Sequelize.Op;

const bcrypt = require('bcryptjs');
const _ = require('lodash')

exports.getUsers = (req, resp) => {
    
    USER.findAll({})
    .then( users => {

        if ( !users || users.length === 0) {
            resp.status(400).send({message: 'No se han encontrado usuarios registrados' });
            return;
        }
        resp.status(200).send(users)
    })
    .catch(error => {
        resp.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener la lista de usuarios'})
    })
}

exports.createUser = (req, res) => {

    let pass = req.body.password
    
    if (pass.length != 8) {
        return res.status(400).send({message: 'La contraseña debe tener una longitud de 8 caracteres'});
    }

    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        password: bcrypt.hashSync(req.body.password, 8),
        preferedCoin: req.body.preferedCoin,
    }

    USER.create(user)
    .then(newUser => {
        return res.status(200).send({ message: 'Usuario registrado exitosamente' });
    })
    .catch(error => {
        console.error(error.message);
        res.status(500).send({message: error.message || 'Ha ocurrido un error creando el usuario!'})
    })
}

exports.addUserCoin = async (req, res) => {

    let tokenUser = await service.decodeToken(req.headers.token);
    let userVerified =  req.user == tokenUser;
    let userNameBody = req.body.userName;
    let newCoin = req.body.newCoin;

    if (userVerified) {
        return USER.findByPk(tokenUser)
        .then( user =>{

            if (!user || user.userName != userNameBody ) {
                return res.status(400).send({ message: 'No se ha encontrado el usuario solicitado' });
            }

            COIN.findOne({
                where: { code: newCoin }
            }).then(coin => {

                if (!coin || coin.code != newCoin ) { 
                    return res.status(400).send({ message: 'No se ha encontrado la moneda que intenta agregar' });
                }

                const userCoin = {
                    userID: user.id,
                    coinID: coin.id, 
                }

                USERCOIN.create(userCoin)
                .then(newUserCoin => {
                    return res.status(200).send({ message: 'Se ha agregado la moneda exitosamente ' });
                })
                .catch(error => {
                    console.error(error.message);
                    res.status(500).send({message: error.message || 'Ha ocurrido un error agregando la nueva moneda al usuario!'})
                })

            })
            .catch( error =>{
                res.status(500).send({ message: 'Ha ocurrido un error al momento de agregar una nueva moneda a un usuario'})
            })

        })
        .catch( error =>{
            res.status(500).send({ message: 'Ha ocurrido un error al momento de intentar agregar una moneda a un usuario' })
        })

    } else {
        res.status(401).send({ message: 'En este momento no puede agregar monedas al usuario solicitado' });
    }
}

exports.preferedCoin = async (req, res) => {

    let tokenUser = await service.decodeToken(req.headers.token);
    let userVerified =  req.user == tokenUser;
    let userNameBody = req.body.userName;
    let prefered = req.body.prefered;

    if (userVerified) {
        return USER.findByPk(tokenUser)
        .then( user =>{

            if (!user || user.userName != userNameBody ) {
                return res.status(400).send({ message: 'No se ha encontrado el usuario solicitado' });
            }

            COIN.findOne({
                where: { code: prefered }
            }).then(coin => {

                if (!coin || coin.code != prefered ) { 
                    return res.status(400).send({ message: 'No se ha encontrado la moneda que intenta establecer como favorita' });
                }

                prefered = {
                    preferedCoin:prefered
                }

                USER.update(prefered,{where:{id:user.id}})
                .then(preferedCoin => {
                    return res.status(200).send({ message: 'Se ha agregado la moneda favorita exitosamente ' });
                })
                .catch(error => {
                    console.error(error.message);
                    res.status(500).send({message: error.message || 'Ha ocurrido un error agregando la moneda favorita al usuario!'})
                })                

            })
            .catch( error =>{
                res.status(500).send({ message: 'Ha ocurrido un error al momento de agregar una nueva moneda favorita'})
            })

        })
        .catch( error =>{
            res.status(500).send({ message: 'Ha ocurrido un error al momento de intentar agregar una moneda favorita a un usuario' })
        })

    } else {
        res.status(401).send({ message: 'En este momento no puede agregar moneda favorita al usuario solicitado' });
    }

}

exports.getPreferedCoin = async (req, res) => {
    
    let tokenUser = await service.decodeToken(req.headers.token);
    let userVerified =  req.user == tokenUser;

    if (userVerified) {

        USER.findOne({ where: {id: tokenUser }})
        .then( user => {

            if ( !user || user.length === 0) {
                res.status(400).send({message: 'No se ha encontrado el usuario solicitado' });
                return;
            }
            
            return COIN.findOne({ where: { code: user.preferedCoin } })
            .then( coin => {

                if ( !coin || coin.length === 0) {
                    res.status(400).send({message: 'No se han encontrado monedas asociadas al usuario' });
                    return;
                }
                res.status(200).send(coin)
            })
            .catch(error => {
                res.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener la lista de monedas asociadas'})
            })
           
        })
        .catch(error => {
            res.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener el usuario solicitado'})
        })

    } else {
        res.status(401).send({ message: 'En este momento no se puede consultar la moneda favorita del usuario solicitado' });
    }
}

exports.getUserCoins = async (req, res) => {

    let tokenUser = await service.decodeToken(req.headers.token);
    let userVerified =  req.user == tokenUser;

    if (userVerified) {

        USERCOIN.findAll({ where: {userID: tokenUser}})
        .then( async userCoins => {

            if ( !userCoins || userCoins.length === 0) {
                res.status(400).send({message: 'No se han encontrado monedas asociadas a este usuario' });
                return;
            }

            let coinID = _.map(userCoins,  coinsID =>{
                return coinsID.coinID
            })

            return COIN.findAll({ 
                where: {
                    id: {
                        [Op.in]: coinID
                    }
                } 
            })
            .then( coinsU => {

                if ( !coinsU || coinsU.length === 0) {
                    res.status(400).send({message: 'No se han encontrado monedas asociadas al usuario' });
                    return;
                }
                res.status(200).send(coinsU)
            })
            .catch(error => {
                res.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener la lista de monedas asociadas'})
            })

        })
        .catch(error => {
            res.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener la lista de monedas asociadas a un usuario'})
        })

    } else {
        res.status(401).send({ message: 'En este momento no se pueden coonsultar las monedas asociadas al usuario solicitado' });
    }
}

exports.topCoins = async (req, res) => {
    
    let tokenUser = await service.decodeToken(req.headers.token);
    let userVerified =  req.user == tokenUser;
    let order = req.params.order;

    console.log(order,'order');

    if (userVerified) {

        USER.findOne({ where: {id: tokenUser }})
        .then( user => {

            if ( !user || user.length === 0) {
                res.status(400).send({message: 'No se ha encontrado el usuario solicitado' });
                return;
            }
            
            return COIN.findOne({ where: { code: user.preferedCoin } })
            .then( preferedCoin => {

                if ( !preferedCoin || preferedCoin.length === 0) {
                    res.status(400).send({message: 'No se han encontrado monedas asociadas al usuario' });
                    return;
                }
                
                USERCOIN.findAll({ where: {userID: tokenUser}})
                    .then( async userCoins => {

                        if ( !userCoins || userCoins.length === 0) {
                            res.status(400).send({message: 'No se han encontrado monedas asociadas a este usuario' });
                            return;
                        }

                        let coinID = _.map(userCoins,  coinsID =>{
                            return coinsID.coinID
                        })

                        return COIN.findAll({ 
                            where: {
                                id: {
                                    [Op.in]: coinID
                                }
                            } 
                        })
                        .then( async coinsU => {

                            let priceQuoteArray = [];

                            if ( !coinsU || coinsU.length === 0) {
                                res.status(400).send({message: 'No se han encontrado monedas asociadas al usuario' });
                                return;
                            }

                            for (let coinPrice of coinsU) {

                                let valueQuote = await priceQuote(preferedCoin.price,coinPrice.price);
                                
                                priceQuoteArray.push({
                                    'name': coinPrice.name,
                                    'price': `${valueQuote.toFixed(2)}`,
                                    'reference': `${preferedCoin.code}`
                                })
                            }

                            let top = _.orderBy(priceQuoteArray, ['price'], [order]);
                            let finalTop = top.slice(0,3);

                            res.status(200).send(finalTop);
                            
                        })
                        .catch(error => {
                            res.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener la lista de monedas asociadas'})
                        })

                    })
                    .catch(error => {
                        res.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener la lista de monedas asociadas a un usuario'})
                    })

            })
            .catch(error => {
                res.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener la lista de monedas asociadas'})
            })
           
        })
        .catch(error => {
            res.status(500).send({message: error.message || 'Ha ocurrido un error intentando obtener el usuario solicitado'})
        })

    } else {
        res.status(401).send({ message: 'En este momento no se puede realizar el top 3 a las monedas del usuario solicitado' });
    }
}