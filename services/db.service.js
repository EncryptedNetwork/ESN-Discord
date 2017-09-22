const config = require('../utils/config')
const uid = require('../utils/uid')

let firebase = require('firebase')

let dbconfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  storageBucket: process.env.STORAGE_BUCKET
}

firebase.initializeApp(dbconfig)

// STATUS INITIALIZER
if(firebase.apps.length) {
  config.STATUS_DB = "online"
  console.log("DB Service Online")
}

// FIREBASE DIRECTORY INITIALIZER
let esndb = firebase.database().ref('esn')
let users = esndb.child('users')

// let ranks = esndb.child('ranks')

exports.esndb = esndb

exports.newDiscordUser = function(discordid, username) {
  let date = new Date()
  let esnid = uid.generateUID()
  console.log('creating new user with esnid: ' + esnid)
  
  let user = {}
  user.credits = 0
  user.username = username
  user.created = date
  user.discordid = discordid
  user.esnid = esnid
  user.exp = 0
  user.level = 0
  user.expup = 100
  user.totalexp = 0
  user.rank = "user"

  users.child(esnid).update(user)
}

// **DEPRECATED**
exports.userExists = function(userid) {
  return users.child(userid).once('value').then(userSnapshot => {
    let user = userSnapshot.val()

    if(user) {
      return true
    } else {
      return false
    }
  })
}

exports.getUser = function(userid) {
  return users.child(userid).once('value').then(userSnapshot => {
    let user = userSnapshot.val()
    return user
  })
}

exports.getUserRank = function(userid) {
  return users.child(userid).once('value').then(function(userSnapshot) {
    let user = userSnapshot.val()

    return ranks.child(user.rank).once('value').then(function(rankSnapshot) {
      let rank = rankSnapshot.val()

      return rank
    })
  })
}

exports.getUserByDiscordID = function(discordid) {
  return new Promise((resolve, reject) => {
      var max = 0
      return users.orderByChild('discordid').equalTo(discordid).once('value', function(snapshot) {
          snapshot.forEach(function(childAppSnapshot) {
              max++
          })

          if(max === 0) {
              resolve(null)
          }
          
          return snapshot.forEach(function(childAppSnapshot) {
              let user = childAppSnapshot.val()
              resolve(user)
          })
      })
  })
}