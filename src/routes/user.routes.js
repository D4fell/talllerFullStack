'use strict'

const router = require('express').Router();
const users = require('../controllers/user.controller');
const { verifyUserName } = require ('../middleware/registryVerify');
const auth = require('../middleware/auth');

router.get('/',users.getUsers);

router.post('/registry', verifyUserName, users.createUser);

router.post('/addUserCoin/:userID', auth, (req, res) =>{
    req.user = req.params.userID;
    let response = users.addUserCoin(req, res);
})

router.post('/preferedCoin/:userID', auth, (req, res) =>{
    req.user = req.params.userID;
    let response = users.preferedCoin(req, res);
})

router.get('/getPreferedCoin/:userID', auth, (req, res) =>{
    req.user = req.params.userID;
    let response = users.getPreferedCoin(req, res);
})

router.get('/getUserCoins/:userID', auth, (req, res)=>{
    req.user = req.params.userID;
    let response = users.getUserCoins(req, res);
})

router.get('/topCoins/:userID/:order', auth, (req, res) =>{
    req.user = req.params.userID;
    let response = users.topCoins(req, res);
})

module.exports = router;