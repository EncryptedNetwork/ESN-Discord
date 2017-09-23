const express = require('express')
const uid = require('../../utils/uid')
const db = require('../../services/db.service')
const UserService = require('../../services/user.service')

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

router.post('/discord', (req, res, next) => {
    let ngid = req.userid
    let authDiscordID = req.body.discordid

    UserService.generateDiscordAuthCode(ngid, authDiscordID).then((response) => {
        if(response.code === '200 C') {
            res.send({ status: 'success', authCode: response.discordAuthCode, message: 'Auth Code generated, please verify.' })
        }
        else {
            res.send({ status: 'error', error: 'There was an issue validating the user for authentication.'})
        }
    })
    
})

module.exports = router