$(document).ready(function(){

    $('#native-login').submit(function(e) {
        let email = $('#form-email').val()
        let password = $('#form-pass').val()

        let authCookie = getCookie('authenticated')
        let ngidCookie = getCookie('ngid')

        var data = {
            email: email,
            password: password,
            authenticated: authCookie,
            userid: ngidCookie
        }

        $.ajax({
            method: 'POST',
            url: '/api/v1/login',
            data: JSON.stringify(data),
            contentType: 'application/json',
            datatype: 'json',
            success: function(res) {
              if(res.status === "success") {
                console.log(res.message + res.token)
                window.location = res.profile
                
                // window.location.href = "https://nativegaming.me/user/" + req.ngid
              } else if(res.status === "error") {
                console.log(res.message)
              }
              
            }
          })

        e.preventDefault()
        return false
    })

    function setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }

    function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

})