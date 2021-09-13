'use strict'

const services = require('../services/index');
const db = require('../models');
const USER = db.user;
const bcrypt = require('bcryptjs');

const user = {
    id: '1000',
    firstName: 'Test',
    lastName: 'Services',
    userName: 'testservices',
    password: bcrypt.hashSync('12345678', 8),
    preferedCoin: 'BTC',
}

describe('token', () =>{

    beforeEach( async () => {
        await USER.destroy({where:{id:'1000'}})        
        USER.create(user)
    });

    test('decodificación de token ', async () => {
        let encrypt = await services.createToken( user )
        let decrypt = await services.decodeToken( encrypt );
        expect(decrypt).toEqual('1000');
    });
    
});