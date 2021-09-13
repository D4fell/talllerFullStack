'use strict'

const service = require('../services');

let tokenVerify = (req, res, next) => {

    if (!req.headers.token) {
        return res.status(403).send({ message: 'El usuario no tiene autorización'});
    }

    const token = req.headers.token;
        
    service.decodeToken(token)
    .then( response =>{
        req.user = response
        next();
    })
    .catch( error => {
        res.status(500).send({message: 'Token Inválido'});
    })
};

module.exports = tokenVerify;