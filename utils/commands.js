module.exports = {
  'help': {
    handler: require(`../cmds/help`),
    description: `Help command. Type \`\`~help support\`\` for a more detailed explanation.`,
    blockBot: true,
    permLevel: 20
  },
  'profile': {
    handler: require(`../cmds/profile`),
    description: `Shows your profile or the profile of another if so-asked.`,
    blockBot: true,
    permLevel: 20
  },
  'signup': {
    handler: require(`../cmds/signup`),
    description: `Creates your account in the Encrypted Network. `,
    blockBot: true,
    permLevel: 20
  },
  'flip': {
    handler: require(`../cmds/flip`),
    description: 'Flip a coin! True, blissful randomness.',
    blockBot: true,
    permLevel: 20
  },
  'version': {
    handler: require(`../cmds/version`),
    description: 'Version Debugger.',
    blockBot: true,
    permLevel: 20
  },
  'restart': {
    handler: require(`../cmds/restart`),
    description: 'Restarts the Discord Bot.',
    blockBot: true,
    permLevel: 4
  },
  'rank': {
    handler: require(`../cmds/rank`),
    description: 'Rank command. Used to manage ranks.',
    blockBot: true,
    permLevel: 4
  },
  'id': {
    handler: require(`../cmds/id`),
    description: 'Used to get your Discord ID.',
    blockBot: true,
    permLevel: 20
  },
  'lucky': {
    handler: require(`../cmds/lucky`),
    description: 'Luckiness detector. Use at your own risk.',
    blockBot: true,
    permLevel: 20
  },
  'purge': {
    handler: require(`../cmds/purge`),
    description: 'Purge the past <insert count here>, or add a filter!',
    blockBot: true,
    permLevel: 8
  },
  'off': {
    handler: require(`../cmds/off`),
    description: 'Turns off the Discord Bot, which enables developer mode.',
    blockBot: true,
    permLevel: 5
  }
}

/* 
RANKS:
 - OWNER: 1
 - DEVELOPER: 1
 - JRDEV: 5
 - ADMIN: 6
 - TMOD: 10
 - VERIFIED-USER: 19 (NOT IMPLEMENTED)
 - USER: 20

OTHER 10 RANK PARAMS ARE FOR CUSTOM RANKS THAT MAY BE CREATED
*/