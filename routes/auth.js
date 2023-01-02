const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const functions = require('../controllers/functions');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/', (req, res) => {
    functions.ChecaCookies(req) ? res.render('index') : res.render('login');
})
  
router.get('/login', function (req, res) {
    if(req.headers.cookie){
        const cookie = req.headers.cookie.split('=')[0]
        if(cookie == "userID"){
            res.redirect('./');
        } else {       
            res.render('login');
        }
    } else {
        res.render('login');
    }
    
})

router.get('/cadastro', function (req, res) {
    if(req.headers.cookie){
        const cookie = req.headers.cookie.split('=')[0]
        if(cookie == "userID"){
            res.redirect('./');
        } else {       
            res.render('cadastro');
        }
    } else {
        res.render('cadastro');
    }
    
})

router.get('/logout', (req, res) => {
    const cookiesKeys = functions.ListaCookiesKeys(req);
    for(let i = 0; i < cookiesKeys.length; i++){
        res.clearCookie(`${cookiesKeys[i]}`);
    } 
    res.render('login');
})

module.exports = router;