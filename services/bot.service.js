const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../utils/config')
const commands = require('../utils/commands')
const db = require('../services/db.service')

const esndb = db.esndb

let DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

if(config.CON_DISCORD) {
  client.login(DISCORD_BOT_TOKEN)
}

client.on('ready', () => {
  config.STATUS_DISCORD = "online"
  console.log('Discord Service Online.')
  client.user.setGame(`Dev Build v` + config.version)
})

// FIREBASE THINGS
// let users = esndb.child('users')
// let ranks = esndb.child('ranks')

// COMMAND MANAGER (TO BE ADDED)
client.on('message', message => {
  const {author, content, channel, member} = message
  const args = content.split(' ')
  let commandKey = args.shift()
  commandKey = commandKey.toLowerCase()

  // // CHAT FILTER PARAMS + REQUIRE
  // const cparams = {author, message, channel}
  // require('../utils/chatfilter')(esndb, cparams)

  // DOES THE MESSAGE INCLUDE THE PREFIX?
  if (!commandKey.includes(config.prefix)) return
  commandKey = trim(commandKey, config.prefix)
  const command = commands[commandKey]
  const params = {author, channel, args, client, member, message}

  // require('../utils/music')(esndb, params)

  if(!command) {
    return
  }

  if(config.COMMAND_CLEANUP) message.delete()

  db.getUserByDiscordID(author.id).then((user) => {
    if (!user) {
      if (command.permLevel <= 20) {
        command.handler(esndb, params)
        return
      } else {
        channel.sendEmbed({
          color: config.COLOR_ERROR,
          title: `Permission Error`,
          description: `You do not have permission to issue this command.`
        })
        return
      }
    }

    let rank = user.rank

    ranks.child(rank).once('value').then((rankSnapshot) => {
      let rank = rankSnapshot.val()

      if (command.permLevel >= rank.power) {
        command.handler(esndb, params)
        return
      } else {
        channel.send({ embed: {
          color: config.COLOR_ERROR,
          title: `Permission Error`,
          description: `You do not have permission to issue this command.`
        }})
        return
      }
    })
  })
})

// DB User Manager
client.on('guildMemberAdd', (member) => {
  db.getUserByDiscordID(member.id).then((user) => {
    if (!user) {
      db.newDiscordUser(member.id, member.nickname)
      return
    }

    let rank = user.rank

    ranks.child(rank).once('value').then((rankSnapshot) => {
      let userRank = rankSnapshot.val()

      let specrole = userRank.display
      let role = member.guild.roles.find("name", specrole)
      member.setRoles([role])
    })
  })
})

// client.on('message', message => {
//   if (!message.author.bot) return
//     let filteredWords = ['help on the way']
//     let content = message.content.toLowerCase()
//     console.log(message.content)
//     if(message.embeds[0].title.includes(filteredWords)) {
//       console.log(message.embeds[0])
//       message.delete(1000)
//     }
//     if(content.includes(filteredWords)) {
//       message.delete(1000)
//     } else {
//       return
//     }
// })

// (U-OP)
client.on('message', message => {
  if(!config.MESSAGE_CLEANUP) return
  if(message.author.bot) {
    setTimeout(
      message.delete()
    ), 1000 * config.MESSAGE_TIMER
  } else return
})

module.exports = client

function trim (s, mask) {
  while (~mask.indexOf(s[0])) {
    s = s.slice(1)
  }
  while (~mask.indexOf(s[s.length - 1])) {
    s = s.slice(0, -1)
  }
  return s
}