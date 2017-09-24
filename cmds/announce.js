const utils = require('../utils/config')
const Discord = require('discord.js')
const config = require('../utils/config')

var announcements = {}

module.exports = (esndb, params) => {
    const {
    	author, 
    	args, 
    	channel, 
    	client, 
        member
    } = params

    const {
        username,
        id: userId
      } = author

      var announcementsChannel = client.channels.get("359915513473662977")

      let init = args[0]
      let two = args[1]
      let anname = args[2]

      if(init === "new" | init === "n") {
          if(two === "up" || two === "er" || two === "sc" || two === "al") {
              if(anname) {
                  newAnnouncement(anname, two)
                  channel.send({ embed: { color: utils.COLOR_SUCCESS, title: `Announcement ${anname} created!`, description: `Continue the announcement process by assigning a title and a few fields: \`\`${config.prefix}announce title <announcement name> <title>\`\`! You can preview what your announcement looks like by typing \`\`${config.prefix}announce preview\`\`!`}})
              } else {
                channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating announcement`, description: `Please enter an announcement name. Create an announcement using \`\`${config.prefix}announce new <announcement name> <type>\`\`!`}})
              }
          } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Type Not Recognized`, description: `The announcement type '${two}' does not exist. Please create an announcement using \`\`${config.prefix}announce new <type: up / er / sc / al> <announcement name>\`\`!`}})
          }
      } else if(init === "title" || init === "t") {
          if(announcements[two]) {
            delete args[0]
            delete args[1]
            let title = args.join(' ')
            setTitle(two, title)
            channel.send({ embed: { color: utils.COLOR_SUCCESS, title: `Title for ${two} assigned!`, description: `Finish the announcement process by assigning a field or two: \`\`${config.prefix}announce add <announcement name> <FIELD TITLE> | <FIELD BODY>\`\`, be sure to type the "|" in between your title and body!`}})
          } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating announcement`, description: `The announcement '${two}' does not exist. Please create an announcement using \`\`${config.prefix}announce new <announcement name> <type>\`\`!`}})
          }
      } else if(init === "add" | init === "a") {
          if(announcements[two]) {
            delete args[0]
            delete args[1]
            let field = args.join(' ')
            let fieldname = field.split('|')[1]
            field = field.split('|')[0]
            addField(two, fieldname, field)
            channel.send({ embed: { color: utils.COLOR_SUCCESS, title: `Field for ${two} created!`, description: `Once you are done adding fields, type \`\`${config.prefix}announce send <announcement name>\`\` to send your announcement officially!`}})
          } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating announcement`, description: `The announcement '${two}' does not exist. Please create an announcement using \`\`${config.prefix}announce new <announcement name> <type>\`\`!`}})
          }
      } else if(init === "preview" || init === "p") {
        if(announcements[two]) {
            previewAnnouncement(two, channel)
        } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating announcement`, description: `The announcement '${two}' does not exist. Please create an announcement using \`\`${config.prefix}announce new <announcement name> <type>\`\`!`}})
        }
      }else if(init === "send" || init === "s") {
          if(announcements[two]) {
              sendAnnouncement(two, announcementsChannel)
              channel.send({ embed: { color: utils.COLOR_SUCCESS, title: `Announcement Sent to Official Announcements Channel`, description: `Your announcement has been sent! Feel free to check it out and make sure everything is correct @ #announcements.`}})
          } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating announcement`, description: `The announcement '${two}' does not exist. Please create an announcement using \`\`${config.prefix}announce new <announcement name> <type>\`\`!`}})
          }
      } else {
        channel.send({ embed: { color: utils.COLOR_ERROR, title: `Usage Error`, description: `Usage: \`\`${config.prefix}announce <new / title / add / preview> <announcement name> <arguments>\`\``}})
      }
}

function newAnnouncement(name, type) {
    announcements[name] = new Discord.RichEmbed()

    if(type == "up")
        announcements[name].setColor(config.ANNOUNCE_UPDATES)
    if(type == "er")
        announcements[name].setColor(config.ANNOUNCE_ERROR)
    if(type == "sc")
        announcements[name].setColor(config.ANNOUNCE_SCHEDULED)
    if(type == "al")
        announcements[name].setColor(config.ANNOUNCE_ALERTS)
}

function setTitle(name, title) {
    announcements[name].title = title
}

function addField(name, fieldname, field) {
    announcements[name].addField(field, fieldname)
}

function previewAnnouncement(name, channel) {
    // let announcementToSend = new Discord.RichEmbed()
    //     .setTitle(announcements[name].title)
        // .setColor(announcements.)
    announcements[name].setTimestamp()
    announcements[name].setFooter("© Encrypted Network")
    channel.send({embed: announcements[name]})
}

function sendAnnouncement(name, channel) {
    announcements[name].setTimestamp()
    announcements[name].setFooter("© Encrypted Network")
    channel.send({embed: announcements[name]})
}