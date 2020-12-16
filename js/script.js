// Search bar Handler
$(function(){
    let searchField = $('#query');
    let icon = $('#search-btn');

    // Focus Event Handler (search open)
    $(searchField).on('focus', function(){
        $(this).animate({
            width:'100%'
        }, 500);
        $(icon).animate({
            right: '10px'
        }, 500);
    });

    // Blur Event Handler (search close)
    $(searchField).on('blur', function(){
        if(searchField.val()===''){
            $(searchField).animate({
                width: '45%'
            }, 500, function () {});

            $(icon).animate({
                right: '360px'
            }, 500, function () {});
        }
    });

    $('#search-form').submit(function(e){
        e.preventDefault();
    });

});

var q;

function search(){
    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            type: 'video',
            q: q,
            key: 'AIzaSyCL4gYJneojY2_S0DQ7HAy4iiB7cOlg-78'},
        function(data){
            let nextPageToken = data.nextPageToken;
            let prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item){
                // Get Output From Search
                let output = getOutput(item);

                // Display Results
                $('#results').append(output);
            });

            let buttons = getButtons(prevPageToken, nextPageToken);

            // Display Buttons
            $('#buttons').append(buttons);
        }
    );
}

// Build Output

function getOutput(item){
    let videoID = item.id.videoId;
    let title = item.snippet.title;
    let description = item.snippet.description;
    let thumb = item.snippet.thumbnails.high.url;
    let channelTitle = item.snippet.channelTitle;
    let videoDate = item.snippet.publishedAt;

    console.log("Video id: " + videoID);
    // Build Output String

    var output = '<li>' +
        '<div class="list-left">' +
        '<img src="'+thumb+'">' +
        '</div>' +
        '<div class="list-right">' +
        '<h3><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/'+videoID+'">'+title+'</a></h3>' +
        '<small>By <span class="cTitle">'+channelTitle+'</span> on '+videoDate+'</small>' +
        '<p>'+description+'</p>' +
        '</div>' +
        '</li>' +
        '<div class="clearfix"></div>' +
        '';

    return output;
}

// Next Page Function

function nextPage() {
    let token = $('#next-button').data('token');
    q = $('#next-button').data('query');

    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            type: 'video',
            q: q,
            pageToken: token,
            key: 'AIzaSyCL4gYJneojY2_S0DQ7HAy4iiB7cOlg-78'},
        function(data){
            let nextPageToken = data.nextPageToken;
            let prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item){
                // Get Output From Search
                let output = getOutput(item);

                // Display Results
                $('#results').append(output);
            });

            let buttons = getButtons(prevPageToken, nextPageToken);

            // Display Buttons
            $('#buttons').append(buttons);
        }
    );
}

// Previous Page Function

function prevPage() {
    let token = $('#prev-button').data('token');
    q = $('#prev-button').data('query');

    // Clear Results
    $('#results').html('');
    $('#buttons').html('');

    // Get Form Input
    q = $('#query').val();

    // Run GET Request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet, id',
            type: 'video',
            q: q,
            pageToken: token,
            key: 'AIzaSyCL4gYJneojY2_S0DQ7HAy4iiB7cOlg-78'},
        function(data){
            let nextPageToken = data.nextPageToken;
            let prevPageToken = data.prevPageToken;

            // Log Data
            console.log(data);

            $.each(data.items, function(i, item){
                // Get Output From Search
                let output = getOutput(item);

                // Display Results
                $('#results').append(output);
            });

            let buttons = getButtons(prevPageToken, nextPageToken);

            // Display Buttons
            $('#buttons').append(buttons);
        }
    );
}

// Build Buttons

function getButtons(prevPageToken, nextPageToken) {
    if(!prevPageToken){
        var btnOut = '<div class="button-container">'+
            '<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
            'onclick="nextPage();">Next Page</button></div>'
    } else {
        var btnOut = '<div class="button-container">'+
            '<button id="prev-button" class="paging-button" data-token="'+prevPageToken+'" data-query="'+q+'"' +
            'onclick="prevPage();">Previous Page</button>' +
            '<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'"' +
            'onclick="nextPage();">Next Page</button></div>'
    }
    return btnOut;

}

// Fires whenever a player has finished loading
function onPlayerReady(event) {
    event.target.playVideo();
}

// Fires when the player's state changes.
function onPlayerStateChange(event) {
    // Go to the next video after the current one is finished playing
    if (event.data === 0) {
        $.fancybox.next();
    }
}

// The API will call this function when the page has finished downloading the JavaScript for the player API
function onYouTubePlayerAPIReady() {

    // Initialise the fancyBox after the DOM is loaded
    $(document).ready(function() {
        $(".fancybox")
            .attr('rel', 'gallery')
            .fancybox({
                openEffect  : 'none',
                closeEffect : 'none',
                nextEffect  : 'none',
                prevEffect  : 'none',
                padding     : 0,
                margin      : 50,
                beforeShow  : function() {
                    // Find the iframe ID
                    var id = $.fancybox.inner.find('iframe').attr('id');

                    // Create video player object and add event listeners
                    var player = new YT.Player(id, {
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    });
                }
            });
    });

}

