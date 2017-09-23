const express = require('express')
const db = require('../../services/db.service')
const supportService = require('../../services/support.service')

// LINK: /admin/tickets/<here>

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
    supportService.getPendingTickets().then((tickets) => {
        res.render('pages/admin/tickets',  { user: { 
            ngid: req.userid, 
            profile: '/user/' + req.userid 
            },
            tickets: tickets
        })
    })
})

// router.get('/accepted', (req, res, next) => {
//     console.log('GETTING ACCEPTED YEET')
//     db.getAcceptedApplications().then((apps) => {
//         res.render('pages/admin/applications', { status: 'success', apps: apps, filter: 'accepted' })
//     })
// })
 
// router.get('/denied', (req, res, next) => {
//     console.log('ok GETTING DENIED APPS')
//     db.getDeniedApplications().then((apps) => {
//         res.render('pages/admin/applications', { status: 'success', apps: apps, filter: 'denied' })
//     })
// })



router.get('/:ticketid', (req, res, next) => {
    let ticketid = req.params.ticketid
    supportService.getPendingTickets().then((tickets) => {
        supportService.getTicket(ticketid).then((ticketbody) => {
        if(ticketbody) {
            tickets.special = ticketbody
            
            res.render('pages/admin/tickets',  { user: { 
            ngid: req.userid, 
            profile: '/user/' + req.userid 
            },
            tickets: tickets
        })
        } else {
            res.render('pages/error/error', { 
                error: {
                    status: '404 B',
                    message: 'Ticket not found.'}
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
