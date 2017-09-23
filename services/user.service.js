const db = require('./db.service')
const esndb = db.esndb
const bcryptpromise = require('../utils/bcryptpromise')
const uid = require('../utils/uid')

let users = esndb.child('users')

exports.authenticateUser = function(email, password) {
    return this.getUserByEmail(email).then((user) => {
        // DOES USER EXIST?
        if(user) {

            return bcryptpromise.compare(password, user.password).then((valid) => {
                if(valid) {
                    let token = uid.generateToken()
                    db.storeToken(token, user.ngid)
                    let data = {
                        status: 'success',
                        message: 'Verified',
                        token: token,
                        ngid: user.ngid
                    }
                    return data
                    } else {
                        let data = {
                            status: 'error',
                            message: 'Username/Password Incorrect'
                        }
                        return data
                    }
            })
        } else {
            let data = {
                status: 'error',
                message: 'Username/Password Incorrect'
            }
            return data
        }     
    })
}

exports.createUser = function(email, password, username) {
    return this.getUserByEmail(email).then((user) => {

        if(user) {
            let data = {
                status: 'error',
                message: "Error, user with that email already exists."
            }
            return data
        } else {
            return bcryptpromise.hash(password).then((hashedPass) => {
                    let ngid = uid.generateAppUID()
                    let date = new Date()
                    users.child(ngid).update({
                        email: email,
                        username: username,
                        password: hashedPass,
                        creationdate: date,
                        level: 0,
                        exp: 0,
                        expup: 100,
                        totalexp: 0, 
                        credits: 100, 
                        rank: "user", 
                        ngid: ngid,
                        achievements: "*None yet*", 
                        profilebarcolor: "9807270"
                    })
                    let data = {
                        status: 'success',
                        message: "User created.",
                        ngid: ngid
                    }
                    return data
            })
        }
    })
}

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

exports.getUserByNGID = function(ngid) {
    return new Promise((resolve, reject) => {
        return users.orderByChild('ngid').equalTo(ngid).once('value', (snapshot) => {
            return snapshot.forEach(function(childAppSnapshot) {
                let user = childAppSnapshot.val()
                resolve(user)
            })
        })
    })
}

exports.generateDiscordAuthCode = function(ngid, discordid) {
    return new Promise((resolve, reject) => {
        return users.orderByChild('ngid').equalTo(ngid).once('value', function(userSnapshot) {
            let user = userSnapshot.val()
            if(user) {
                let authCode = uid.generateAppUID()
                users.child(ngid).update({
                    discordAuth: authCode,
                    udiscordid: discordid
                })
                let msg = {
                    msg: "Success! Please finish the verification process.",
                    discordAuthCode: authCode,
                    code: '200 C'
                }
                return resolve(msg)
            } else {
                let msg = {
                    code: '404 F',
                    error: "User does not exist on NG Network."
                }
                return resolve(msg)
            }
        })
    })
}

exports.verifyDiscordUser = function(ngid, code) {
    return new Promise((resolve, reject) => {
        return this.getUserByNGID(ngid).then((user) => {

            if(user) {
                if(user.discordAuth === code) {
                    let verifiedId = user.udiscordid
                    users.child(ngid).update({
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