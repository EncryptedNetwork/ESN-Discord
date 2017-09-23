const express = require('express')
const db = require('../../services/db.service')

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

router.use((req, res, next) => {
    if(req.userid) {
        db.getUserRank(req.userid).then((rank) => {
            if(rank.power < 5) {
                next()
                return
            } else {
                res.render('pages/error/error', { 
            error: {
                status: '401 - A',
                message: 'You do not have sufficient permissions to view this page. RIP.',
            },
            user: { 
                esnid: req.userid, 
                profile: '/user/' + req.userid 
            }
            })
                return
            }
        })
    } else {
        res.render('pages/error/error', { 
            error: {
                status: '401 - A',
                message: 'You do not have sufficient permissions to view this page. RIP.'
            },
            user: { 
                esnid: req.userid, 
                profile: '/user/' + req.userid 
            }
            })
        return
    }
})

router.get('/', (req, res, next) => {
    res.render('pages/admin/admin',  { user: { esnid: req.userid, profile: '/user/' + req.userid }})
})

router.use('/apps', require('./applications'))
router.use('/tickets', require('./tickets'))

module.exports = router