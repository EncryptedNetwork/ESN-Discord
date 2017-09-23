$(document).ready(function(){

  var ticketId = $('#1').attr('ticketid')

  var currentTicketId = ticketId

  if($('[special]').val()) {
    currentTicketId = $('#ticket-title').attr('ticketid')
  } else {
    loadDefault()
  }

  function loadDefault() {

  let ticketIdData = {
    ticketid: ticketId
  }

  console.log(ticketId)

    $.ajax({
        method: 'POST',
        url: '/api/v1/support/getTicket',
        data: JSON.stringify(ticketIdData),
        contentType: 'application/json',
        datatype: 'json',
        success: function(res) {
            if(res.status === "success") {
              $('#ticket-title').html(res.ticketbody.name)
              $('#ticket-name').html(res.ticketbody.name)
              $('#ticket-email').html(res.ticketbody.email)
              $('#ticket-steamprofile').html(res.ticketbody.steamprofile)
              $('#ticket-type').html(res.ticketbody.type)
              $('#ticket-issue').html(res.ticketbody.issue)
              $('#ticket-other').html(res.ticketbody.other)
            } else if(res.status === "error") {
            $('#ticket-info').html(`<strong>` + res.ticketbody.message + `</strong>`)
            }
            
        }
    })
  }

      $(".ticket").click(function(){

        var clickedTicket = $(this).attr('ticketid')

        if(currentTicketId === clickedTicket) {
          return
        }

        currentTicketId = clickedTicket

        console.log(clickedTicket)

        var ticketDataToSend = {
          ticketid: clickedTicket
        }

        $.ajax({
          method: 'POST',
          url: '/api/v1/support/getTicket',
          data: JSON.stringify(ticketDataToSend),
          contentType: 'application/json',
          datatype: 'json',
          success: function(res) {
            if(res.status === "success") {
              $('#ticket-title').html(res.ticketbody.name)
              $('#ticket-name').html(res.ticketbody.name)
              $('#ticket-email').html(res.ticketbody.email)
              $('#ticket-steamprofile').html(res.ticketbody.steamprofile)
              $('#ticket-type').html(res.ticketbody.type)
              $('#ticket-issue').html(res.ticketbody.issue)
              $('#ticket-other').html(res.ticketbody.other)
            } else if(res.status === "error") {
              $('#ticket-info').html(`<strong>` + res.ticketbody.message + `</strong>`)
            }
          }
        })
  })

//   $('#accept').click(function() {
//     var ticketDataToSend = {
//           appid: currentTicketId,
//           update: 'accepted'
//         }

//         $.ajax({
//           method: 'POST',
//           url: '/api/v1/app/updateApp',
//           data: JSON.stringify(ticketDataToSend),
//           contentType: 'application/json',
//           datatype: 'json',
//           success: function(res) {
//             if(res.status === "success") {
//               window.location = "/admin/app"
//             } else if(res.status === "error") {
//               $('#app-info').html(`<strong>` + res.ticketbody.message + `</strong>`)
//             }
            
//           }
//         })
//   })

//   $('#deny').click(function() {
//     var ticketDataToSend = {
//           appid: currentTicketId,
//           update: 'denied'
//         }

//         $.ajax({
//           method: 'POST',
//           url: '/api/v1/app/updateApp',
//           data: JSON.stringify(ticketDataToSend),
//           contentType: 'application/json',
//           datatype: 'json',
//           success: function(res) {
//             if(res.status === "success") {
//               window.location = "/admin/app"
//             } else if(res.status === "error") {
//               $('#app-info').html(`<strong>` + res.ticketbody.message + `</strong>`)
//             }
            
//           }
//         })
//   })

//   $('#accepted').click(function() {
//       window.location.href = '/admin/app/accepted'
//   })

//   $('#denied').click(function() {
//     window.location.href = '/admin/app/denied'
//   })

//   $('#pending').click(function() {
//       window.location.href = '/admin/app'
//   })


})
