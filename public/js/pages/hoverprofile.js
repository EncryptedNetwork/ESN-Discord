$(document).ready(function(){

    $('#hoverprofilecard').hide()

    $('#hp1, #hp2, #hp3').hover(function(e) {
        var userid = $(this).attr('user-id')

        var data = {
            userid: userid
        }

        // $.ajax({
        //     method: 'POST',
        //     url: 'http://ngdb.herokuapp.com/api/v1/getUser',
        //     data: JSON.stringify(data),
        //     contentType: 'application/json',
        //     datatype: 'json',
        //     success: function(res) {
        //       if(res.status === "good") {
        //         var userprofile = res.user
                
        //         $(this).find('#hoverprofile-username').html(res.user.username)
        //         $(this).find('#hoverprofile-rank').html(res.user.rank)
        //         $(this).find('#hoverprofile-email').html(res.user.credits)
        //         $(this).find('#hoverprofile-message').html(`Level ` + res.user.level)
        //         $(this).find('#hoverprofilecard').css( 'position', 'absolute' )
        //         $(this).find('#hoverprofilecard').css( 'top', e.pageY )
        //         $(this).find('#hoverprofilecard').css( 'left', e.pageX )
        //         $(this).find('#hoverprofilecard').css( 'opacity', '80%' )
        //         $(this).find('#hoverprofilecard').show()

        //       } else if(res.status === "bad") {
        //         $(this).find('#hoverprofile-username').html("ERROR")
        //         $(this).find('#hoverprofile-rank').html("ERROR")
        //         $(this).find('#hoverprofile-email').html("ERROR")
        //         $(this).find('#hoverprofile-message').html("ERROR")
        //         $(this).find('#hoverprofilecard').css( 'position', 'absolute' )
        //         $(this).find('#hoverprofilecard').css( 'top', e.pageY )
        //         $(this).find('#hoverprofilecard').css( 'left', e.pageX )
        //         $(this).find('#hoverprofilecard').css( 'opacity', '80%' )
        //         $(this).find('#hoverprofilecard').show()
        //       }
              
        //     }
        //   })

    }, function() {
        $('#hoverprofilecard').hide()
    })
})