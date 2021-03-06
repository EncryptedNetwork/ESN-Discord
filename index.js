require('./services/bot.service')
require('./services/db.service')

// Required requires
const express = require('express')
const app = express()

require('events').EventEmitter.defaultMaxListeners = Infinity

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/wakemydyno.txt', function (req, res) {
    res.render('pages/wakemydyno')
})

app.listen(app.get('port'), function () {
    console.log('App Service Online (' + app.get('port') + ").")
})