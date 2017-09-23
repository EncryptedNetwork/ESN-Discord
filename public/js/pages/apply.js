
$(document).ready(function(){

      $("#native-application").submit(function(e){

          let name = $('#app-name').val()
          let email = $('#app-email').val()
          let sprofile = $('#app-sprofile').val()
          let pos = $('#app-pos').val()
          let netc = $('#app-netc').val()
          let why = $('#app-why').val()
          let past = $('#app-past').val()
          let pers = $('#app-pers').val()

          var application = {
            name: name,
            email: email,
            steamprofile: sprofile,
            position: pos,
            netpos: netc,
            why: why,
            pastexp: past,
            personality: pers,
            state: "pending"
          }

          $.ajax({
            method: 'POST',
            url: '/api/v1/app/newApp',
            data: JSON.stringify(application),
            contentType: 'application/json',
            datatype: 'json',
            success: function(res) {
              if(res.status === "success") {
                $('.applicationarea').html(' ')
                $('#app-info').html(' ')
                $('.page-title').html(`<h2>` + res.message + `</h2><br><p>` + res.desc + `</p>`)
              } else if(res.status === "error") {
                $('#app-info').html(`<strong>` + res.message + `</strong>`)
              }
              
            }
          })

        e.preventDefault()
        return false
  })


})
