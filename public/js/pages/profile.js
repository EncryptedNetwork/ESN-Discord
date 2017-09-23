$(document).ready(function(){

    var discordv = false;

    $('#c-discord').on('click', function(e) {
        if(!discordv) {
            discordv = true
            $(this).css("cursor: none;")
            $(this).html('<form id="discord-verify" class="contact-form"><p>DiscordID: (type "~id" in the NG Discord)</p><input id="c-discordinput" type="text" placeholder="Your Discord ID"><input id="c-discordbutton" type="submit" value="Verify"></div>')
            initializeV()
        } else {
            return
        }
    })

    function initializeV() {
        $('#c-discordbutton').on('click', function(e) {
            let discordId = $('#c-discordinput').val()

            if(discordId.length > 15) {

                var data = {
                    discordid: discordId
                }

                $.ajax({
                    method: 'POST',
                    url: '/api/v1/verify/discord',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    datatype: 'json',
                    success: function(res) {
                        if(res.status === "success") {
                            console.log(res.message)
                            $('#discord-verify').html('Your auth code is: <a class="themecolor">' + res.authCode + '</a>. <br><br>Type "~verify ' + res.authCode + '" into the <a href="https://discord.gg/qazby7t" class="themecolor">NG Discord</a> to finish the verification process.<br><br>')
                        } else if(res.status === "error") {
                            console.log(res.error)
                            $('#discord-verify').html('There was an error: ' + res.error)
                        }
                    }
                })
            } else {
                $('#discord-verify').append('<p style="color: red;">Discord ID invalid.</p>')
            }
            e.preventDefault()
            return false
        })
    }
})