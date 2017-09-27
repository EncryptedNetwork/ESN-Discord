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

exports.newDiscordUser = function(discordid, username, member) {
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
  user.achievements = "**None yet**"

  users.child(esnid).update(user)

  member.send({ embed: { 
    color: utils.COLOR_SUCCESS, 
    title: `Welcome to the Encrypted Server Network, ${member.nickname}!`, 
    description: `We're humbled to have you join our Discord Server, and hopefully you've already been in our Rust Server as well! \n\n
    Our Network doesn't just stop with Rust. In our eyes, gaming never comes to an end; so what does that mean for you? 
    Well, we've rehauled what Discord and all forms of communication can offer and innovated every way to be a part of ESN.`,
    fields: [
      {
        name: `__Leveling/EXP__`,
        value: `Now you may be all like "BUT THIS ISN'T NEW, I'VE BEEN SURROUNDED BY EXP/LEVELING SYSTEMS ALL MY LIFE!" Now you are correct, however, you've never been surrounded by ours. 
        ESN has developed the most innovative and collaborative Leveling/EXP system yet! Ever wanted to be able to get huge prizes, ranks, an abundance of credits that synced across an entire network, across multiple game platforms? 
        Guess what. You can! "How do I get EXP?" One might ask. 
        Well, simply enough - be active! Talk to other ESN members, converse about what ESN should add next, and overall be a role model for other ESN members!`
      },
      {
        name: `__Rust__`,
        value: `Our Rust server is planned for launch this Friday! More details will be provided as the date comes closer. 
        We truly hope with all our hearts combined into one super heart that  you'll be there!`
      },
      {
        name: `__FAQ__`,
        value: `We understand joining new commnunities can be confusing at first, and there's often quite a big learning curve for how things work. So that's why we have a #faq channel in the ESN Discord for you to feast your eyes upon for any quesitons you may have. 
        And if that's not enough, DM either one of the staff members online and we'll attend to your peace-of-mind ASAP!`
      }],
      footer: "© Encrypted Network"
  }})
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