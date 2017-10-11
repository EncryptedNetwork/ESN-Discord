const config = require('../utils/config')
const db = require('../services/db.service')
const UserService = require('../services/user.service')

module.exports = (esndb, params) => {
    const {author, args, channel, client} = params
    
    const users = esndb.child('users')
    const {username, id: userId} = author
    const userProfileID = args[0]
    const amount = args[1]
    

    if(!userProfileID) {

        channel.send({ embed: {
            color: config.COLOR_ERROR,
            title: `Cannot update a user's credits without providing a user argument.`,
            description: `Perhaps you should pick up a book because clearly you lack sufficient IQ to use this command. \nUsage: \`\`!credits <@user#1234 OR Discord User ID> <amount (i.e. -100 or 500 for adding)\`\`.`
        }})
        return

    } else {

        const userProfileIDTrim = trim(userProfileID .toString(), "<!@>abcdefghijklmnopqrstuvwxyz")

        var targetusername

        UserService.getUserByDiscordID(userProfileIDTrim).then((user) => {

            if(!user) {
                channel.send({ embed: {
                    color: config.COLOR_ERROR,
                    title: `Error updating ${targetusername}'s Credits.`,
                    description: `The user could not be found in the database.`
                }})
                return
            }

            client.fetchUser(userProfileIDTrim).then(u => {
                targetavatarURL = u.avatarURL
                targetusername = u.username

                updateUserCredits(user, targetusername, amount)
            })
        })
    }

    function updateUserCredits(user, targetusername, amount) {
        users.child(user.esnid).update({
            credits: (user.credits + amount)
        }).then(() => {
            channel.send({ embed: {
                color: config.COLOR_SUCCESS,
                title: `Updated ${targetusername}'s Credits!!`,
                description: `Subjected ${targetusername}'s Credits to ${amount}`
            }})
        })
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