$(document).ready(function(){

  var appId = $('#1').attr('appid')

  var currentAppId = appId

  if($('[special]').val()) {
    currentAppId = $('#app-title').attr('appid')
  } else {
    loadDefault()
  }

  function loadDefault() {

  let appIdData = {
    appid: appId
  }

  console.log(appId)

    $.ajax({
        method: 'POST',
        url: '/api/v1/app/getApp',
        data: JSON.stringify(appIdData),
        contentType: 'application/json',
        datatype: 'json',
        success: function(res) {
            if(res.status === "success") {
              $('#app-title').html(res.appbody.name)
              $('#app-name').html(res.appbody.name)
              $('#app-email').html(res.appbody.email)
              $('#app-steamprofile').html(res.appbody.steamprofile)
              $('#app-position').html(res.appbody.position)
              $('#app-netpos').html(res.appbody.netpos)
              $('#app-why').html(res.appbody.why)
              $('#app-pastexp').html(res.appbody.pastexp)
              $('#app-personality').html(res.appbody.personality)
            } else if(res.status === "error") {
            $('#app-info').html(`<strong>` + res.appbody.message + `</strong>`)
            }
            
        }
    })
  }

      $(".app").click(function(){

        var clickedApp = $(this).attr('appid')

        if(currentAppId === clickedApp) {
          return
        }

        currentAppId = clickedApp

        console.log(clickedApp)

        var appDataToSend = {
          appid: clickedApp
        }

        $.ajax({
          method: 'POST',
          url: '/api/v1/app/getApp',
          data: JSON.stringify(appDataToSend),
          contentType: 'application/json',
          datatype: 'json',
          success: function(res) {
            if(res.status === "success") {
              $('#app-title').html(res.appbody.name)
              $('#app-name').html(res.appbody.name)
              $('#app-email').html(res.appbody.email)
              $('#app-steamprofile').html(res.appbody.steamprofile)
              $('#app-position').html(res.appbody.position)
              $('#app-netpos').html(res.appbody.netpos)
              $('#app-why').html(res.appbody.why)
              $('#app-pastexp').html(res.appbody.pastexp)
              $('#app-personality').html(res.appbody.personality)
            } else if(res.status === "error") {
              $('#app-info').html(`<strong>` + res.appbody.message + `</strong>`)
            }
            
          }
        })
  })

  $('#accept').click(function() {
    var appDataToSend = {
          appid: currentAppId,
          update: 'accepted'
        }

        $.ajax({
          method: 'POST',
          url: '/api/v1/app/updateApp',
          data: JSON.stringify(appDataToSend),
          contentType: 'application/json',
          datatype: 'json',
          success: function(res) {
            if(res.status === "success") {
              window.location = "/admin/app"
            } else if(res.status === "error") {
              $('#app-info').html(`<strong>` + res.appbody.message + `</strong>`)
            }
            
          }
        })
  })

  $('#deny').click(function() {
    var appDataToSend = {
          appid: currentAppId,
          update: 'denied'
        }

        $.ajax({
          method: 'POST',
          url: '/api/v1/app/updateApp',
          data: JSON.stringify(appDataToSend),
          contentType: 'application/json',
          datatype: 'json',
          success: function(res) {
            if(res.status === "success") {
              window.location = "/admin/app"
            } else if(res.status === "error") {
              $('#app-info').html(`<strong>` + res.appbody.message + `</strong>`)
            }
            
          }
        })
  })

  $('#accepted').click(function() {
      window.location.href = '/admin/app/accepted'
  })

  $('#denied').click(function() {
    window.location.href = '/admin/app/denied'
  })

  $('#pending').click(function() {
      window.location.href = '/admin/app'
  })


})
