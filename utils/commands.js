module.exports = {
  'help': {
    handler: require(`../cmds/help`),
    description: `Help command. Type \`\`~help support\`\` for a more detailed explanation.`,
    blockBot: true,
    permLevel: 10,
    disabled: false
  },
  'profile': {
    handler: require(`../cmds/profile`),
    description: `Shows your profile or the profile of another if so-asked.`,
    blockBot: true,
    permLevel: 20,
    disabled: false
  },
  'flip': {
    handler: require(`../cmds/flip`),
    description: 'Flip a coin! True, blissful randomness.',
    blockBot: true,
    permLevel: 20,
    disabled: false
  },
  'version': {
    handler: require(`../cmds/version`),
    description: 'Version Debugger.',
    blockBot: true,
    permLevel: 20,
    disabled: false
  },
  'restart': {
    handler: require(`../cmds/restart`),
    description: 'Restarts the Discord Bot.',
    blockBot: true,
    permLevel: 4,
    disabled: false
  },
  'rank': {
    handler: require(`../cmds/rank`),
    description: 'Rank command. Used to manage ranks.',
    blockBot: true,
    permLevel: 4,
    disabled: false
  },
  'id': {
    handler: require(`../cmds/id`),
    description: 'Used to get your Discord ID.',
    blockBot: true,
    permLevel: 20,
    disabled: false
  },
  'lucky': {
    handler: require(`../cmds/lucky`),
    description: 'Luckiness detector. Use at your own risk.',
    blockBot: true,
    permLevel: 20,
    disabled: false
  },
  'purge': {
    handler: require(`../cmds/purge`),
    description: 'Purge the past <insert count here>, or add a filter!',
    blockBot: true,
    permLevel: 8,
    disabled: false
  },
  'off': {
    handler: require(`../cmds/off`),
    description: 'Turns off the Discord Bot, which enables developer mode.',
    blockBot: true,
    permLevel: 3,
    disabled: false
  },
  'announce': {
    handler: require(`../cmds/announce`),
    description: 'The announce command. Used to control the announcements in a professional manner.',
    blockBot: true,
    permLevel: 3,
    disabled: false
  },
  'faq': {
    handler: require(`../cmds/faq`),
    description: 'The FAQ command. Used to control the FAQ in a professional manner.',
    blockBot: true,
    permLevel: 3,
    disabled: false
  }
}

/* 
RANKS:
 - OWNER: 1
 - DEVELOPER: 1
 - JRDEV: 5
 - ADMIN: 8
 - MOD: 10
 - REGULAR: 19
 - USER: 20

OTHER 10 RANK PARAMS ARE FOR CUSTOM RANKS THAT MAY BE CREATED
*/