require('./services/bot.service')

// Required requires
const express = require('express')
const app = express()

require('events').EventEmitter.defaultMaxListeners = Infinity

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/wakemydyno.txt', function (req, res) {
    res.render('pages/wakemydyno')
})

app.listen(app.get('port'), function () {
    console.log('Website Service Online (' + app.get('port') + ").")
})