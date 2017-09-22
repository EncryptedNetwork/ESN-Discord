module.exports = {
    'version': {
      handler: require(`../cmds/version`),
      description: 'Version Debugger.',
      blockBot: true,
      permLevel: 20
    },
    'rank': {
      handler: require(`../cmds/rank`),
      description: 'Rank command. Used to manage ranks.',
      blockBot: true,
      permLevel: 20
    }
  }
  
  /* 
  RANKS:
   - OWNER: 1
   - DEVELOPER: 1
   - JRDEV: 5
   - SADMIN: 6
   - ADMIN: 8
   - TMOD: 10
   - VERIFIED-USER: 19 (NOT IMPLEMENTED)
   - USER: 20
  
  OTHER 10 RANK PARAMS ARE FOR CUSTOM RANKS THAT MAY BE CREATED
  */