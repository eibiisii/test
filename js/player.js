$(document).ready(function() {
    var playerIframes = $('iframe.player');
    // Listen for messages from the player
    if (window.addEventListener){
        window.addEventListener('message', onMessageReceived, false);
    }
    else {
        window.attachEvent('onmessage', onMessageReceived, false);
    }
    // Handle messages received from the player
    function onMessageReceived(e) {
        var data = JSON.parse(e.data);

        switch (data.event) {
            case 'ready':
                onReady();
                break;
            case 'playProgress':
                onPlayProgress(data.data);
                break;
            case 'pause':
                onPause();
                break;
            case 'finish':
                onFinish();
                break;
        }
    }

    // Helper function for sending a message to the player
    function post(player, action, value) {
        var data = { method: action };
        
        if (value) {
            data.value = value;
        }
        var url = player.src.split("?")[0];
        player.contentWindow.postMessage(JSON.stringify(data), url);
    }

    function onReady() {
        for (var i=0, length=playerIframes.length; i < length; i++) {
            post(playerIframes[i], 'addEventListener', 'pause');
            post(playerIframes[i], 'addEventListener', 'finish');
            post(playerIframes[i], 'addEventListener', 'playProgress');
            $(playerIframes[i]).on('inview', function(e, isInView, visiblePartX, visiblePartY) {
                if (isInView) {
                    startPlay(this);
                } else {
                    stopPlay(this);
                }
            });
        }
    }

    function onPause() {
    }

    function onFinish() {
    }

    function onPlayProgress(data) {
    }

    function startPlay(player){
        post(player, 'play', function(e){console.log(e);})
    }

    function stopPlay(player){
        post(player, 'pause', function(e){console.log(e);})
    }

    $('.player_button').on('click', function(e) {
        var text = $(this).text();
        var player = $("#" + $(this).val())[0];
        if(text == "start") {
            startPlay(player);
            $(this).text("stop");
        } else if (text == "stop") {
            stopPlay(player);
            $(this).text("start");
        }
    });
});
