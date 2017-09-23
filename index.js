// Service Startups
require('./services/server.service')
require('./services/db.service')

// Error Handlers
process.on('unhandledRejection', r => console.log(r))

// Required requires. (lol)
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const config = require('./utils/config')
const commands = require('./utils/commands')
const { client } = require('./services/server.service')
const UserService = require('./services/user.service')
const passport = require('passport')
// const { ngdb } = require('./services/db.service')

var bodyParser = require('body-parser')

require('events').EventEmitter.defaultMaxListeners = Infinity

app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/public'))

// views is directory for all template files
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(cookieParser())
app.use(bodyParser.json())

app.use(require('./web/routes'))

app.listen(app.get('port'), function () {
  console.log('Website Service Online (' + app.get('port') + ").")
})

// DISCORD STRAT

var DiscordStrategy = require('passport-discord').Strategy;
 
passport.use(new DiscordStrategy(
  {
    clientID: '329460000525123586',
    clientSecret: '_zwlK4C0Oz83c-ZH5WoHJgqlqg2Wghea',
    callbackURL: 'https://nativegaming.me/api/v1/auth/discord/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("THIS IS THE USER:" + profile)
    cb(null, profile)

    // UserService.getUserByDiscordID(profile.id)
    //   .then(user => cb(null, user))
    //   .catch(err => cb(err))
  }
));