'use strict'

const config = require('../../config/auth.config');
const jwt = require('jwt-simple');
const moment = require('moment');

let createToken = (user) => {
    const payload = {
        sub: user.id,
        iat: moment().unix(),
        exp: moment().add(20, 'minutes').unix(),
    }
    return jwt.encode(payload, config.secret)
}

let decodeToken = ( token ) => {
    const decoded = new Promise((resolve, reject) =>{
        try {
            const payload = jwt.decode(token, config.secret);
           
            if (payload.exp <= moment().unix()) {
                reject({
                    status: 401,
                    message: 'El Token ha expirado',
                })
            }

            resolve(payload.sub);
            
        } catch (error) {
            reject({
                status: 500,
                message: 'Token Inválido'
            })
        }
    })
    return decoded;
}

module.exports = {
    createToken,
    decodeToken
} 