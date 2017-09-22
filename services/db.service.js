const config = require('../utils/config')

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
let users = esndb.child('users')

// let ranks = esndb.child('ranks')

exports.esndb = esndb

exports.newUser = function(userid, user) {
  user.esnid = userid
  users.child(userid).update(user)
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

exports.getUserRank = function(ngid) {
  return users.child(ngid).once('value').then(function(userSnapshot) {
    let user = userSnapshot.val()

    return ranks.child(user.rank).once('value').then(function(rankSnapshot) {
      let rank = rankSnapshot.val()

      return rank
    })
  })
}