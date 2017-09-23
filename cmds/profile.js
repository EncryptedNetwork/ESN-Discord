const utils = require('../utils/config')
const db = require('../services/db.service')
const UserService = require('../services/user.service')

module.exports = (esndb, params) => {
    const {author, args, channel, client} = params
    
    const users = esndb.child('users')
    const {username, id: userId} = author
    const userProfileID = args[0]
    

    if(!userProfileID) {
   
        const userDataRequest = UserService.getUserByDiscordID(author.id)
        userDataRequest.then(sendUserDataToDiscord)

    } else {

        const userProfileIDTrim = trim(userProfileID .toString(), "<!@>abcdefghijklmnopqrstuvwxyz")

        var targetusername
        var targetavatarURL

        client.fetchUser(userProfileIDTrim).then(u=>{
             targetusername = u.username
             targetavatarURL = u.avatarURL

             const userDataRequest = UserService.getUserByDiscordID(userProfileIDTrim)
             userDataRequest.then(sendUserDataToDiscord)
      })
    
    }
    
    function sendUserDataToDiscord(user) {
        if(user) {

            channel.send({ embed: {
                color: parseInt(user.profilebarcolor),
                author: {
                  name: author.username,
                  icon_url: author.avatarURL
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
                    name: 'Last Seen On',
                    value: "ESN Rust Server",
                    inline: true
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