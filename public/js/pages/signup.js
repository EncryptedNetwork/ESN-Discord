$(document).ready(function(){

    $('#native-signup').submit(function(e) {
        let email = $('#form-email').val()
        let password = $('#form-pass').val()
        let password2 = $('#form-pass2').val()
        let username = $('#form-username').val()


        if(password === password2) {
            var data = {
                username: username,
                email: email,
                password: password
            }

            $.ajax({
                method: 'POST',
                url: '/api/v1/signup',
                data: JSON.stringify(data),
                contentType: 'application/json',
                datatype: 'json',
                success: function(res) {
                    if(res.status === "success") {
                        console.log(res.message)
                        window.location = res.profile
                    } else if(res.status === "error") {
                        $('#app-info').html(res.message)
                        console.log(res.message)
                    }
                }
            })
        } else {
            $('#app-info').html('Passwords do not match.')
        }

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