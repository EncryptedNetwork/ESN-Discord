const request = require('request')

(function($, document, window){

	$(document).ready(function(){

        $("#app-submit").click(function(e){
			e.preventDefault();

            let name = $('#app-name').val()
            let email = $('#app-email').val()
            let sprofile = $('#app-sprofile').val()
            let pos = $('#app-pos').val()
            let netc = $('#app-netc').val()
            let why = $('#app-why').val()
            let past = $('#app-past').val()
            let pers = $('#app-pers').val()

            var application = {
                uri: '/api/v1/app/newApp',
                method: "POST",
                options: {
                    uri: '/api/v1/app/newApp'
                },
                body: {
                    name: name,
                    email: email,
                    sprofile: sprofile,
                    pos: pos,
                    netc: netc,
                    why: why,
                    past: past,
                    pers: pers
                }
            }

			request(application, (err, resp) => {
                if (err) return console.log('ERROR', err)
                
                var data = JSON.parse(resp.body)
                if (data.error) {
                    console.log(data.error)
                } else {
                    console.log(data.message)
                }
            })
		});

    })
})