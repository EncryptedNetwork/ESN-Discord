const express = require('express')
const db = require('../../services/db.service')

let router = express.Router()

router.use('/api', require('../api'))

router.use((req, res, next) => {
    if(req.cookies.token) {
        let token = req.cookies.token
        db.getToken(token).then((tokenEntry) => {
            if(tokenEntry) {
                req.userid = tokenEntry.ngid
            }
            next()
            return
        })
    } else {
        next()
        return
    }
})

router.get('/', function (req, res) {
    res.render('pages/index',  { user: { ngid: req.userid, profile: '/user/' + req.userid }})
})

router.get('/about', function (req, res) {
    res.render('pages/about',  { user: { ngid: req.userid, profile: '/user/' + req.userid }})
})

router.get('/shop', function (req, res) {
    res.render('pages/shop',  { user: { ngid: req.userid, profile: '/user/' + req.userid }})
})

router.get('/apply', function (req, res) {
    if(!req.userid) {
        res.render('pages/error/error', { 
            error: {
                status: '401 F',
                message: 'You must be logged in to access this page.'
            },
            user: { 
                ngid: req.userid, 
                profile: '/user/' + req.userid 
            }
        })
    }
    res.render('pages/apply', { user: { ngid: req.userid, profile: '/user/' + req.userid }})
})

router.get('/login', function (req, res) {
    if(req.userid) {
        res.redirect('/user/' + req.userid)
        return
    }
    res.render('pages/login',  { user: { ngid: req.userid, profile: '/user/' + req.userid }})
})

router.get('/logout', function(req, res, next) {
    res.clearCookie('token')
    res.render('pages/index',  { user: { ngid: req.userid, profile: '/user/' + req.userid }})
})

router.get('/signup', function (req, res) {
    res.render('pages/signup',  { user: { ngid: req.userid, profile: '/user/' + req.userid }})
})

router.get('/wakemydyno.txt', function (req, res) {
  res.render('pages/wakemydyno')
})

router.get('/support', function(req, res) {
        if(!req.userid) {
        res.render('pages/error/error', { 
            error: {
                status: '401 F',
                message: 'You must be logged in to access this page.'
            },
            user: { 
                ngid: req.userid, 
                profile: '/user/' + req.userid 
            }
        })
    }
    res.render('pages/support', { user: { ngid: req.userid, profile: '/user/' + req.userid }})
})

router.use('/user', require('./user'))

router.use('/admin', require('./admin'))

// router.use('/app', require('./applications'))

router.get('*', function (req, res) {
  res.render('pages/error/error', { 
    error: {
        status: '404 A',
        message: 'Page not found.'
    },
    user: { 
        ngid: req.userid, 
        profile: '/user/' + req.userid 
    }
    })
})

// TODO

module.exports = router