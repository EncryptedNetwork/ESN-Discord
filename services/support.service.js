const db = require('./db.service')
const esndb = db.esndb
const bcryptpromise = require('../utils/bcryptpromise')
const uid = require('../utils/uid')

let users = esndb.child('users')
let tickets = esndb.child('tickets')

exports.newTicket = function(ticketId, ticket) {
  ticket.ticketid = ticketId
  tickets.child(ticketId).update(ticket)
}

exports.getTicket = function(ticketid) {
  return new Promise((resolve, reject) => {
    console.log(ticketid)
    return tickets.child(ticketid).once('value').then(ticketSnapshot => {
      let ticketbody = ticketSnapshot.val()
      resolve (ticketbody)
    })
  })
}

const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
exports.getPendingTickets = function() {
  return new Promise((resolve, reject) => {
    var theTickets = {}
    var i = 1
    var max = 0

    return tickets.orderByChild('state').equalTo('pending').limitToFirst(10).once('value').then(snapshot => {

      snapshot.forEach(function(childTicketSnapshot) {
        max++
      })

      return snapshot.forEach(function(childTicketSnapshot) {
        var sub = numbers[i]
        theTickets[sub] = childTicketSnapshot.val()

        if(i === max) {
          resolve (theTickets)
        }

        i++
      })
    })
  })
}