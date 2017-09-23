const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('../utils/config')
const commands = require('../utils/commands')
const db = require('../services/db.service')
const UserService = require('../services/user.service')
const esndb = db.esndb

let DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

if(config.CON_DISCORD) {
  client.login(DISCORD_BOT_TOKEN)
}

client.on('ready', () => {
  config.STATUS_esndb = "online"
  console.log('Discord Service Online.')
  client.user.setGame(`Dev Build v` + config.version)
})

// FIREBASE THINGS
let users = esndb.child('users')
let ranks = esndb.child('ranks')

// COMMAND MANAGER
client.on('message', message => {
  const {author, content, channel, member} = message
  const args = content.split(' ')
  let commandKey = args.shift()
  commandKey = commandKey.toLowerCase()

  // DOES THE MESSAGE INCLUDE THE PREFIX?
  if (!commandKey.includes(config.prefix)) return
  commandKey = trim(commandKey, config.prefix)
  const command = commands[commandKey]
  const params = {author, channel, args, client, member, message}

  require('../utils/music')(esndb, params)

  if(!command) {
    return
  }

  if(config.COMMAND_CLEANUP) message.delete()

  UserService.getUserByDiscordID(author.id).then((user) => {
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

// DB User Management
client.on('guildMemberAdd', (member) => {
  db.getUserByDiscordID(member.id).then((user) => {
    if (!user) {
      db.newDiscordUser(member.id, member.user.username)
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