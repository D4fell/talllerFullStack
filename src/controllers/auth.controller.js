'use strict'

const db = require('../models');
const USER = db.user;
const service = require('../services')

let bcrypt = require('bcryptjs');

exports.login = (req, res) => {

    USER.findOne({
        where: { userName: req.body.userName }
    })
    .then( user => {
        if (!user) {
            return res.status(400).send({ message: 'El usuario ingresado no existe!' });            
        }

        let isValidPassword = bcrypt.compareSync(req.body.password, user.password);

        if (!isValidPassword) {
            return res.status(401).send({accessToken: null, message: 'Contraseña invalida'});
        }

        res.status(200).send({ token: service.createToken(user) })
    })
    .catch( error => {
        res.status(500).send({ message: error.message || 'Ha ocurrido un error autenticando el usuario!' });
    })
}