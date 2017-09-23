const config = require(`../utils/config`)

module.exports = (esndb, params) => {
  const { author, channel, args } = params

  const { username } = author
  const commands = require(`../utils/commands`)

  let selection = args[0]
  
  if(selection) {

    // COMMAND HELP
    let commandKey = args[0].toString().toLowerCase()
    commandKey = trim(commandKey, config.prefix)
    let command = commands[commandKey]
    
    if(!command) {
      // CUSTOM HELP SECTIONS
      switch (selection) {

        case "support":
          sendHelpOnWay(channel, author)
          sendHelpHelp(channel, author)
          return
          break

        case "cmd":
          sendHelpOnWay(channel, author)
          sendCMDHelp(channel, author)
          return
          break
      }
      sendHelpNotFound(channel, author)
      return
    }
    
    channel.send(`**Command:** *${commandKey}* \n**Description:** *${command.description}* \n**PermLevel:** *${command.permLevel}*`)
  } else {
    sendHelpOnWay(channel, author)
    sendCMDHelp(channel, author)
  }
}

function sendHelpNotFound(channel, author) {
  channel.send({ embed: {
    color: config.COLOR_ERROR,
    title: `No help on the way, ` + author.username + `!`,
    description: `There wasn't any help for the parameters provided.`
  }})
}

function sendHelpOnWay(channel, author) {
  channel.send({ embed: {
    color: config.COLOR_WARNING,
    title: `Help on the way, ` + author.username + `!`,
    description: `I'ma slide into your DM's and hit you up with the help you need! :wink:`
  }})
}

function sendHelpHelp(channel, author) {
  author.send({ embed: {
    color: config.COLOR_WARNING,
    title: `Help on the way, ` + author.username + `!`,
    description: `I'ma slide into your DM's and hit you up with the help you need! :wink:`
  }})
}

function sendDefaultHelp(channel, author) {
  author.send({ embed: {
    color: config.COLOR_WARNING,
    title: `Help on the way, ` + author.username + `!`,
    description: `I'ma slide into your DM's and hit you up with the help you need! :wink:`
  }})
}

function sendCMDHelp(channel, author) {
  author.send({ embed: {
    color: config.COLOR_SUCCESS,
    title: `Encrypted Network Staff Help`,
    description: `Staff Help Section`,
    fields: [
      {
        name: `__Help Command__`,
        value: `The \`\`~help\`\` command is useful for acquiring information about a specific subject. The help command features many different sections such as 'cmd', 'server', and 'support'. Simply type \`\`~help <help section>\`\` to proceed!`
      },
      {
        name: `__Specific Help__`,
        value: `The help command features a interactive command look up system. Simply type \`\`~help <cmd>\`\` to receive information about the command at hand.`,
        inline: true
      }]
  }})
}

function trim (s, mask) {
  while (~mask.indexOf(s[0])) {
    s = s.slice(1)
  }
  while (~mask.indexOf(s[s.length - 1])) {
    s = s.slice(0, -1)
  }
  return s
}