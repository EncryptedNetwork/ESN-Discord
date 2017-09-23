
$(document).ready(function(){

      $("#native-ticket").submit(function(e){

          let name = $('#sup-name').val()
          let sprofile = $('#sup-sprofile').val()
          let type = $('#sup-type').val()
          let issue = $('#sup-issue').val()
          let other = $('#sup-other').val()

          var ticket = {
            name: name,
            steamprofile: sprofile,
            type: type,
            issue: issue,
            other: other,
            state: "pending"
          }

          $.ajax({
            method: 'POST',
            url: '/api/v1/support/newTicket',
            data: JSON.stringify(ticket),
            contentType: 'application/json',
            datatype: 'json',
            success: function(res) {
              if(res.status === "success") {
                $('.supportarea').html(' ')
                $('#sup-info').html(' ')
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
