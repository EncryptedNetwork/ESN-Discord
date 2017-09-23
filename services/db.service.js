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
let esndb = firebase.database().ref('esndb')
let applications = esndb.child('applications')
let users = esndb.child('users')
let tokens = esndb.child('tokens')
let ranks = esndb.child('ranks')

exports.esndb = esndb

exports.newApp = function(appId, application) {
  application.appid = appId
  applications.child(appId).update(application)
}

exports.newDiscordUser = function(discordid, username) {
  let date = new Date()
  let esnid = uid.generateUID()
  
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

exports.getApplication = function(appid) {
  return new Promise((resolve, reject) => {
    return applications.child(appid).once('value').then(appSnapshot => {
      let appbody = appSnapshot.val()
      resolve (appbody)
    })
  })
}

const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
exports.getPendingApplications = function() {
  return new Promise((resolve, reject) => {
    var apps = {}
    var i = 1
    var max = 0

    return applications.orderByChild('state').equalTo('pending').limitToFirst(10).once('value').then(snapshot => {

      snapshot.forEach(function(childAppSnapshot) {
        max++
      })

      return snapshot.forEach(function(childAppSnapshot) {
        var sub = numbers[i]
        apps[sub] = childAppSnapshot.val()

        if(i === max) {
          resolve (apps)
        }

        i++
      })
    })
  })
}

exports.getAcceptedApplications = function() {
  return new Promise((resolve, reject) => {
    var apps = {}
    var i = 1
    var max = 0

    return applications.orderByChild('state').equalTo('accepted').limitToFirst(10).once('value').then(snapshot => {

      snapshot.forEach(function(childAppSnapshot) {
        max++
      })

      return snapshot.forEach(function(childAppSnapshot) {
        var sub = numbers[i]
        apps[sub] = childAppSnapshot.val()

        if(i === max) {
          resolve (apps)
        }

        i++
      })
    })
  })
}

exports.getDeniedApplications = function() {
  return new Promise((resolve, reject) => {
    var apps = {}
    var i = 1
    var max = 0

    return applications.orderByChild('state').equalTo('denied').limitToFirst(10).once('value').then(snapshot => {

      snapshot.forEach(function(childAppSnapshot) {
        max++
      })

      return snapshot.forEach(function(childAppSnapshot) {
        var sub = numbers[i]
        apps[sub] = childAppSnapshot.val()

        if(i === max) {
          resolve (apps)
        }

        i++
      })
    })
  })
}

exports.updateApp = function(appid, update) {
  return applications.child(appid).update({
    state: update
  })
}

exports.storeToken = function(token, ngid) {
  return tokens.child(token).update({
    token: token,
    ngid: ngid
  })
}

exports.getToken = function(token) {
  return tokens.child(token).once('value').then(tokenSnapshot => tokenSnapshot.val())
}

exports.getUserRank = function(ngid) {
  return users.child(ngid).once('value').then(function(userSnapshot) {
    let user = userSnapshot.val()

    return ranks.child(user.rank).once('value').then(function(rankSnapshot) {
      let rank = rankSnapshot.val()

      return rank
    })
  })
}