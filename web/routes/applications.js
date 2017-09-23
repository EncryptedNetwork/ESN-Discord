const express = require('express')
const db = require('../../services/db.service')

// LINK: /admin/apps/<here>

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

router.get('/', (req, res, next) => {
    db.getPendingApplications().then((apps) => {
        res.render('pages/admin/applications',  { user: { 
            ngid: req.userid, 
            profile: '/user/' + req.userid 
            },
            apps: apps
        })
    })
})

router.get('/accepted', (req, res, next) => {
    console.log('GETTING ACCEPTED YEET')
    db.getAcceptedApplications().then((apps) => {
        res.render('pages/admin/applications', { status: 'success', apps: apps, filter: 'accepted' })
    })
})
 
router.get('/denied', (req, res, next) => {
    console.log('ok GETTING DENIED APPS')
    db.getDeniedApplications().then((apps) => {
        res.render('pages/admin/applications', { status: 'success', apps: apps, filter: 'denied' })
    })
})



router.get('/:appid', (req, res, next) => {
    let appid = req.params.appid
    db.getPendingApplications().then((apps) => {
        db.getApplication(appid).then((appbody) => {
        if(appbody) {
            apps.special = appbody
            
            res.render('pages/admin/applications',  { user: { 
            ngid: req.userid, 
            profile: '/user/' + req.userid 
            },
            apps: apps
        })
        } else {
            res.render('pages/error/error', { 
                error: {
                    status: '404 B',
                    message: 'App not found.'}
                })
            }
        })
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
