const express = require('express')
const db = require('../../services/db.service')

var router = express.Router()

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

router.get('/:userid', (req, res, next) => {
    let userid = req.params.userid

    console.log('requesting user: ' + userid)

    db.getUser(userid).then((user) => {
        console.log(user)
        if(user) {
            if(req.userid === userid) {
                res.render('pages/profile',  { target: user, user: { ngid: req.userid, profile: '/user/' + req.userid, own: true }})
            } else {
                res.render('pages/profile',  { target: user, user: { ngid: req.userid, profile: '/user/' + req.userid, own: false }})
            }
        } else {
            console.log('user does not exist')
            res.render('pages/error/error', { 
                error: {
                    status: '404 C',
                    message: 'User not found.'}
                })
            }
    })

    // if(db.userExists(userid)) {
    //     console.log('user apparently eixsts')
    //     var user = db.getUser(userid)
    //     console.log('user exists. name: ' + user.name)
    //     res.render('pages/profile', { user: user })
    // } else {
    //     console.log('user does not exist')
    //     res.render('pages/home', { error: '404 Page not found. Took a wrong turn?'})
    // }
})

module.exports = router
