const express = require('express')
const uid = require('../../utils/uid')
const db = require('../../services/db.service')
const UserService = require('../../services/user.service')
const passport = require('passport')

var router = express.Router()

router.use((req, res, next) => {
    if(req.cookies.token) {
        let token = req.cookies.token
        db.getToken(token).then((tokenEntry) => {
            if(tokenEntry) {
                req.userid = tokenEntry.esnid
            }
            next()
            return
        })
    } else {
        next()
        return
    }
})

router.post('/getUser', (req, res, next) => {
    let userid = req.body.userid

    db.getUserByESNID(userid).then((user) => {
        if(user) {
            res.send({status: 'success', user: user})
        } else {
            res.send({status: 'error'})
        }
    })
})

router.post('/login', (req, res,next) => {

    // if(req.userid) {
    //     console.log('YEETE' + req.cookies.token)
    //     res.send({ status: 'success', profile: '/user/' + req.userid})
    //     return
    // }

    let email = req.body.email
    let password = req.body.password

    if(!email || !password) {
        return
    }

    UserService.authenticateUser(email, password).then((data) => {

        if(data.status === "success") {
            data.profile = "/user/" + data.esnid
            res.cookie("token", data.token)
        }

        res.send(data)
        return
    })  
})

router.use('/logout', (req, res, next) => {
    res.clearCookie('token')
    res.render('pages/index',  { user: { esnid: req.userid, profile: '/user/' + req.userid }})
})

router.post('/signup', (req, res, next) => {
    if(req.userid) {
        res.send({status: 'error', message: "You're already logged into an ESN Account.", profile: '/user/' + req.userid})
    } else {
        let email = req.body.email
        let password = req.body.password
        let username = req.body.username

        UserService.createUser(email, password, username).then((result) => {
            result.profile = "/user/" + result.esnid
            res.send(result)
        })
    }
})

router.post('/gmod', (req, res, next) => {
    
})

// APPS
router.use('/app', require('./app'))

// VERIFY
router.use('/verify', require('./verify'))

// SUPPORT
router.use('/support', require('./support'))

router.get('/auth/discord', passport.authenticate('discord'))

router.get('/auth/discord/callback', (req, res, next) => {
  passport.authenticate('discord', function(err, profile) {
    if (err) return next(err)

    console.log('okokok ', profile)
    res.redirect('https://google.com')

  })(req, res, next)
})

module.exports = router