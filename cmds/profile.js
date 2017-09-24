const utils = require('../utils/config')
const db = require('../services/db.service')
const UserService = require('../services/user.service')

module.exports = (esndb, params) => {
    const {author, args, channel, client} = params
    
    const users = esndb.child('users')
    const {username, id: userId} = author
    const userProfileID = args[0]
    

    if(!userProfileID) {

        var targetusername
        var targetavatarURL

        UserService.getUserByDiscordID(author.id).then((user) => {
            client.fetchUser(author.id).then(u => {
                targetavatarURL = u.avatarURL
                targetusername = u.username

                sendUserDataToDiscord(user, targetusername, targetavatarURL)
            })
        })

    } else {

        const userProfileIDTrim = trim(userProfileID .toString(), "<!@>abcdefghijklmnopqrstuvwxyz")

        var targetusername
        var targetavatarURL

        UserService.getUserByDiscordID(userProfileIDTrim).then((user) => {
            client.fetchUser(userProfileIDTrim).then(u => {
                targetavatarURL = u.avatarURL
                targetusername = u.username

                sendUserDataToDiscord(user, targetusername, targetavatarURL)
            })
        })
    }
    
    function sendUserDataToDiscord(user, targetusername, targetavatarURL) {
        if(user) {
            
            channel.send({ embed: {
                color: barColor(user.level),
                author: {
                  name: targetusername,
                  icon_url: targetavatarURL
                },
                fields: [{
                    name: 'Rank',
                    value: user.rank,
                    inline: true
                },
                {
                    name: 'Level',
                    value: user.level,
                    inline: true
                },
                {
                    name: 'EXP',
                    value: user.exp + "/" + user.expup + " (" + user.totalexp + " total)",
                    inline: true
                },
                {
                    name: 'Credits',
                    value: "§" + user.credits,
                    inline: true
                },
                {
                    name: 'Achievements',
                    value: user.achievements,
                    inline: false
                }
                ],
                timestamp: new Date(),
                footer: {
                  text: '© Encrypted Network'
                }
            }});
        } else {
            // const newLog = {log: "User " + username + " attempted to retrieve non-existent statistics.", logtype: "error", timestamp: new Date().toString()};
            // logs.push(newLog);
            channel.send({ embed: { color: utils.COLOR_ERROR, description: "It seems you've encountered an error in our network. There seems to be no profile associated with the user provided."}})
        }
    }
}

//TRIM CMD
function trim(s, mask) {
    while (~mask.indexOf(s[0])) {
        s = s.slice(1);
    }
    while (~mask.indexOf(s[s.length - 1])) {
        s = s.slice(0, -1);
    }
    return s;
}

function barColor(level) {
    if(between(level, 0, 9)) {
        return 0xA3A3A3
    }
    if(between(level, 10, 19)) {
        return 0xD4314F
    }
    if(between(level, 20, 29)) {
        return 0xED941F
    }
    if(between(level, 30, 39)) {
        return 0xDDE635
    }
    if(between(level, 40, 49)) {
        return 0x25AB0E
    }
    if(between(level, 50, 59)) {
        return 0x25BAB2
    }
    if(between(level, 60, 69)) {
        return 0x9E0DE0
    }
    if(between(level, 70, 79)) {
        return 0xE868D1
    }
    if(between(level, 80, 89)) {
        return 0x660033
    }
    if(between(level, 90, 99)) {
        return 0xD6B46B
    }
    if(between(level, 100, 109)) {
        return 0x7D5807
    }
    if(between(level, 110, 119)) {
        return 0x000000
    }


}

function between(x, min, max) {
    return x >= min && x <= max;
}