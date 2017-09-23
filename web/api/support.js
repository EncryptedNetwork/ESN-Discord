const express = require('express')
const uid = require('../../utils/uid')
const db = require('../../services/db.service')
const UserService = require('../../services/user.service')
const supportService = require('../../services/support.service')

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

router.post('/newTicket', (req, res, next) => {
    let { name, steamprofile, type, issue, other, state } = req.body

    if(!name || !steamprofile || !type || !issue) {
        res.send({status: 'error', message: 'Could not submit ticket. Please fill out all the required fields appropriately.'})
    } else {
        let key = uid.generateAppUID()
        let date = new Date()
        UserService.getUserByESNID(req.userid).then((user) => {
            let ticket = {
                name: name,
                email: user.email,
                steamprofile: steamprofile,
                type: type,
                issue: issue,
                other: other,
                date: date,
                state: state,
                esnid: req.userid
            }

            supportService.newTicket(key, ticket)
            res.send({status: 'success', message: 'Ticket submitted!', desc: "Your ticket has been submitted. It may take up to 3 days for the ticket to receive a response. Submitting another ticket will simply delay the process. Ticket ID: " + key})
        })
    }
})

router.post('/getTicket', (req, res, next) => {
    let ticketId = req.body.ticketid

    supportService.getTicket(ticketId).then((ticketbody) => {
        res.send({ status: 'success', ticketbody: ticketbody})
    })
})

router.get('/:ticketid', (req, res, next) => {
    let ticketId = req.params.ticketid
    supportService.getPendingTickets().then((tickets) => {
        supportService.getPendingTickets(ticketId).then((ticketbody) => {
        if(ticketbody) {
            tickets.special = ticketbody
            res.render('pages/admin/tickets', { tickets: tickets })
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