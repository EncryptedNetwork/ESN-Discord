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

router.post('/getApp', (req, res, next) => {
    let appId = req.body.appid

    db.getApplication(appId).then((appbody) => {
        res.send({ status: 'success', appbody: appbody})
    })
})

router.post('/updateApp', (req, res, next) => {
    let appId = req.body.appid
    let update = req.body.update

    db.updateApp(appId, update).then((appbody) => {
        res.send({ status: 'success', message: 'successssss'})
    })
})

router.post('/newApp', (req, res, next) => {
    let { name, email, steamprofile, position, netpos, why, pastexp, personality, state } = req.body

    if(!name || !email || !steamprofile || !position || !netpos || !why || !pastexp || !personality) {
        res.send({status: 'error', message: 'Could not submit application. Please fill out all the fields appropriately.'})
    } else {
        let key = uid.generateAppUID()
        let date = new Date()
        let application = {
            name: name,
            email: email,
            steamprofile: steamprofile,
            position: position,
            netpos: netpos,
            why: why,
            pastexp: pastexp,
            personality: personality,
            date: date,
            state: state,
            ngid: req.userid
        }
        
        db.newApp(key, application)
        res.send({status: 'success', message: 'Application submitted!', desc: "Your application has been submitted. It may take up to a week for it to process and for you to be further contacted. Thank you for applying! App ID: " + key})
    }
})

module.exports = router