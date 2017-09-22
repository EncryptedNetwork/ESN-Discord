require('./services/bot.service')

require('events').EventEmitter.defaultMaxListeners = Infinity

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function () {
    console.log('Website Service Online (' + app.get('port') + ").")
})