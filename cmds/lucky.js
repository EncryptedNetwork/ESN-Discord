const utils = require('../utils/config')

let inviteOptions = {
    maxAge: 1800,
    maxUses: 1,
    temporary: false
}

module.exports = (esndb, params) => {
    const {
    	author, 
    	args, 
    	channel, 
    	client, 
        member,
        message
    } = params

    const {
        username,
        id: userId
      } = author

      channel.send(username + " " + luckyFlip())

      function luckyFlip() {
        let flip = Math.floor(Math.random() * (3 - 1)) + 1
        let result

        if(flip === 1) {
            channel.createInvite(inviteOptions).then((invite) => {
                author.send("Here's the invite back into the server: " + invite)
                setTimeout(function() {
                    let kickMember = message.guild.member(author)
                    kickMember.kick("I told u my dad owned microsoft nd now u got baned for bing gay")
                }, 4000)
            })
            result = "is unlucky! :black_circle:"
        }

        if(flip === 2) {
            result = "is lucky! :white_circle:"
        }

        return result;
      }
}