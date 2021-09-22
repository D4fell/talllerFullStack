'use strict'

const router = require('express').Router();
const coins = require('../controllers/coin.controller');
const { verifyCoinCode } = require ('../middleware/registryVerify');

router.get('/', coins.getCoins);
router.get('/getCoin/:code', coins.getCoinCode);
router.post('/registry', verifyCoinCode,  coins.createCoin);

module.exports = router;