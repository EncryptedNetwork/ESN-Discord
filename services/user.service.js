const db = require('./db.service')
const esndb = db.esndb
// const bcryptpromise = require('../utils/bcryptpromise')
const uid = require('../utils/uid')

let users = esndb.child('users')

// exports.authenticateUser = function(email, password) {
//     return this.getUserByEmail(email).then((user) => {
//         // DOES USER EXIST?
//         if(user) {

//             return bcryptpromise.compare(password, user.password).then((valid) => {
//                 if(valid) {
//                     let token = uid.generateToken()
//                     db.storeToken(token, user.esnid)
//                     let data = {
//                         status: 'success',
//                         message: 'Verified',
//                         token: token,
//                         esnid: user.esnid
//                     }
//                     return data
//                     } else {
//                         let data = {
//                             status: 'error',
//                             message: 'Username/Password Incorrect'
//                         }
//                         return data
//                     }
//             })
//         } else {
//             let data = {
//                 status: 'error',
//                 message: 'Username/Password Incorrect'
//             }
//             return data
//         }     
//     })
// }

// exports.createUser = function(email, password, username) {
//     return this.getUserByEmail(email).then((user) => {

//         if(user) {
//             let data = {
//                 status: 'error',
//                 message: "Error, user with that email already exists."
//             }
//             return data
//         } else {
//             return bcryptpromise.hash(password).then((hashedPass) => {
//                     let esnid = uid.generateAppUID()
//                     let date = new Date()
//                     users.child(esnid).update({
//                         email: email,
//                         username: username,
//                         password: hashedPass,
//                         creationdate: date,
//                         level: 0,
//                         exp: 0,
//                         expup: 100,
//                         totalexp: 0, 
//                         credits: 100, 
//                         rank: "user", 
//                         esnid: esnid,
//                         achievements: "*None yet*", 
//                         profilebarcolor: "9807270"
//                     })
//                     let data = {
//                         status: 'success',
//                         message: "User created.",
//                         esnid: esnid
//                     }
//                     return data
//             })
//         }
//     })
// }

exports.getUserByEmail = function(email) {
    return users.orderByChild('email').equalTo(email).once('value').then(function(userSnapshot) {
        let user = userSnapshot.val()
        if(user) {
            var key = Object.keys(user)[0]
            return user[key]
        } else {
            return null
        }
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

// exports.getUserByDiscordID = function(discordid) {
//     return new Promise((resolve, reject) => {
//         return users.orderByChild('discordid').equalTo(discordid).once('value', function(userSnapshot) {
//             let user = userSnapshot.val()

//             resolve(user)
//         })
//     })
// }

exports.getUserByESNID = function(esnid) {
    return new Promise((resolve, reject) => {
        return users.orderByChild('esnid').equalTo(esnid).once('value', (snapshot) => {
            return snapshot.forEach(function(childAppSnapshot) {
                let user = childAppSnapshot.val()
                resolve(user)
            })
        })
    })
}

exports.verifyDiscordUser = function(esnid, code) {
    return new Promise((resolve, reject) => {
        return this.getUserByESNID(esnid).then((user) => {

            if(user) {
                if(user.discordAuth === code) {
                    let verifiedId = user.udiscordid
                    users.child(esnid).update({
                        discordid: verifiedId,
                        discordAuth: null,
                        udiscordid: null
                    })
                    let msg = {
                        code: '202 A',
                        msg: 'Auth Code accepted. Discord Account verified.'
                    }
                    resolve(msg)
                } else {
                    let msg = {
                        error: 'Auth Code Invalid',
                        code: '400 A'
                    }
                    resolve(msg)
                }
            }
        })
    })
}