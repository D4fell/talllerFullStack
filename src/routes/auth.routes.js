'use strict'

const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/verified', auth, (req, res) => {
    res.status(200).send({ message: 'Tiene Acceso' });
});

module.exports = router;