$(document).ready(function(){

        data = {}

        $.ajax({
            method: 'POST',
            url: '/api/v1/logout',
            data: JSON.stringify(data),
            contentType: 'application/json',
            datatype: 'json',
            success: function(res) {
              if(res.status === "success") {
                console.log(req.message)
                // window.location.href = "ngdb.herokuapp.com/user/" + req.ngid
                
              } else if(res.status === "error") {
                console.log(req.message)
              }
              
            }
          })

          setCookie('authenticated', null)
          setCookie('ngid', null)

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
