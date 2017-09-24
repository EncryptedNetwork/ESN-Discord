const utils = require('../utils/config')
const Discord = require('discord.js')
const config = require('../utils/config')

var FAQs = {}

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

      var FAQsChannel = client.channels.get("361341032987885568")

      let init = args[0]
      let two = args[1]
      let anname = args[2]

      if(init === "new" | init === "n") {
          if(two === "up" || two === "er" || two === "sc" || two === "al") {
              if(anname) {
                  newFAQ(anname, two)
                  channel.send({ embed: { color: utils.COLOR_SUCCESS, title: `FAQ ${anname} created!`, description: `Continue the FAQ process by assigning a title and a few fields: \`\`${config.prefix}faq title <FAQ name> <title>\`\`! You can preview what your FAQ looks like by typing \`\`${config.prefix}faq preview\`\`!`}})
              } else {
                channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating FAQ`, description: `Please enter an FAQ name. Create an FAQ using \`\`${config.prefix}faq new <FAQ name> <type>\`\`!`}})
              }
          } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Type Not Recognized`, description: `The FAQ type '${two}' does not exist. Please create an FAQ using \`\`${config.prefix}faq new <type: up / er / sc> <FAQ name>\`\`!`}})
          }
      } else if(init === "title" || init === "t") {
          if(FAQs[two]) {
            delete args[0]
            delete args[1]
            let title = args.join(' ')
            setTitle(two, title)
            channel.send({ embed: { color: utils.COLOR_SUCCESS, title: `Title for ${two} assigned!`, description: `Finish the FAQ process by assigning a field or two: \`\`${config.prefix}faq add <FAQ name> <FIELD TITLE> | <FIELD BODY>\`\`, be sure to type the "|" in between your title and body!`}})
          } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating FAQ`, description: `The FAQ '${two}' does not exist. Please create an FAQ using \`\`${config.prefix}faq new <FAQ name> <type>\`\`!`}})
          }
      } else if(init === "add" | init === "a") {
          if(FAQs[two]) {
            delete args[0]
            delete args[1]
            let field = args.join(' ')
            let fieldname = field.split('|')[1]
            field = field.split('|')[0]
            addField(two, fieldname, field)
            channel.send({ embed: { color: utils.COLOR_SUCCESS, title: `Field for ${two} created!`, description: `Once you are done adding fields, type \`\`${config.prefix}faq send <FAQ name>\`\` to send your FAQ officially!`}})
          } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating FAQ`, description: `The FAQ '${two}' does not exist. Please create an FAQ using \`\`${config.prefix}faq new <FAQ name> <type>\`\`!`}})
          }
      } else if(init === "preview" || init === "p") {
        if(FAQs[two]) {
            previewFAQ(two, channel)
        } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating FAQ`, description: `The FAQ '${two}' does not exist. Please create an FAQ using \`\`${config.prefix}faq new <FAQ name> <type>\`\`!`}})
        }
      }else if(init === "send" || init === "s") {
          if(FAQs[two]) {
              sendFAQ(two, FAQsChannel)
              channel.send({ embed: { color: utils.COLOR_SUCCESS, title: `FAQ Sent to Official FAQs Channel`, description: `Your FAQ has been sent! Feel free to check it out and make sure everything is correct @ #FAQs.`}})
          } else {
            channel.send({ embed: { color: utils.COLOR_ERROR, title: `Error locating FAQ`, description: `The FAQ '${two}' does not exist. Please create an FAQ using \`\`${config.prefix}faq new <FAQ name> <type>\`\`!`}})
          }
      } else {
        channel.send({ embed: { color: utils.COLOR_ERROR, title: `Usage Error`, description: `Usage: \`\`${config.prefix}faq <new / title / add / preview> <FAQ name> <arguments>\`\``}})
      }
}

function newFAQ(name, type) {
    FAQs[name] = new Discord.RichEmbed()

    if(type == "up")
        FAQs[name].setColor(config.faq_UPDATES)
    if(type == "er")
        FAQs[name].setColor(config.faq_ERROR)
    if(type == "sc")
        FAQs[name].setColor(config.faq_SCHEDULED)
    if(type == "al")
        FAQs[name].setColor(config.faq_ALERTS)
}

function setTitle(name, title) {
    FAQs[name].title = title
}

function addField(name, fieldname, field) {
    FAQs[name].addField(field, fieldname)
}

function previewFAQ(name, channel) {
    // let FAQToSend = new Discord.RichEmbed()
    //     .setTitle(FAQs[name].title)
        // .setColor(FAQs.)
    FAQs[name].setTimestamp()
    FAQs[name].setFooter("© Encrypted Network")
    channel.send({embed: FAQs[name]})
    console.log(FAQs[name])
}

function sendFAQ(name, channel) {
    FAQs[name].setTimestamp()
    FAQs[name].setFooter("© Encrypted Network")
    channel.send({embed: FAQs[name]})
}