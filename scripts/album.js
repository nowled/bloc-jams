var setSong = function (songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    // #1
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        // #2
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);

};
var setCurrentTimeInPlayerBar = function(currentTime){
     
      $currentTime = $('.current-time');
     //current time updates with song playback.
       $currentTime.text(filterTimeCode(currentTime));
    
  };
   

 var setTotalTimeInPlayerBar = function(totalTime){
       
     
         $totalTime = $('.total-time');
         $totalTime.text(filterTimeCode(totalTime));
    
        
    };

var filterTimeCode = function(timeInSeconds) {
   
    //Use the parseFloat() method to get the seconds in number form.
   var  seconds = parseFloat(Math.floor(timeInSeconds % 60));
    var minutes = Math.floor(timeInSeconds / 60);
      //ternary operator if seconds is less than 10 add a zero to seconds
    //else keep the seconds as is
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
};


//Add a setVolume() function that takes one argument, a volume value, and wraps the Buzz setVolume() method with a conditional statement that checks to see if a  currentSoundFile exists:
var seek = function (time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}
var setVolume = function (volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }

};


var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};


var createSongRow = function (songNumber, songName, songLength) {
    var template =

        '<tr class="album-view-song-item">' + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + '  <td class="song-item-title">' + songName + '</td>' + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>' + '</tr>';

    var $row = $(template);




    var clickHandler = function () {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            
           
            //  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({
                left: currentVolume + '%'
            });
              $(this).html(pauseButtonTemplate);
            updatePlayerBarSong();

        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }

        }

    };

    var onHover = function (event) {

        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));


        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }

    };


    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);

    return $row;
};



var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');

//Here set values to each part of the album
var setCurrentAlbum = function (album) {
    currentAlbum = album;
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    // clear list of album song list container
    // albumSongList.innerHTML = '';
    $albumSongList.empty();

    // Build List of Songs from Album
    for (var i = 0; i < album.songs.length; i++) {
        /** albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration); **/
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};
var updateSeekBarWhileSongPlays = function () {
    if (currentSoundFile) {
        // #10
        // "timeupdate" fires repeatedly while time elapses during song playback.
        currentSoundFile.bind('timeupdate', function (event) {
            // #11
            //getTime() method  gets the current time of the song
            //And the getDuration() method gets the total length of the song. Both values //return //time in seconds.
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(this.getTime());
        });
    }
};

var updateSeekPercentage = function ($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // #2 This converts the percentage offsetXPercent to a string
    var percentageString = offsetXPercent + '%';
    //In the below code our css perceives the percentageString as a percent instead of a unit
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({
        left: percentageString
    });
};

var setupSeekBars = function () {
    // 6
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function (event) {
        // #3//JQuery event.pageX does the obvious sets offsetX to horizontal position
        //we subtract the offset of the seekbar so
        //everything to the left of event.pageX is deleted so that
        //everything in event.pageX to the right will be proportioned to the green of the seekbar
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #4
        var seekBarFillRatio = offsetX / barWidth;
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }

        // #5
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    $seekBars.find('.thumb').mousedown(function (event) {
        // #8
        var $seekBar = $(this).parent();


        // #9
        $(document).bind('mousemove.thumb', function (event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio * 100);
            }

            updateSeekPercentage($seekBar, seekBarFillRatio);
        });

        // #10
        $(document).bind('mouseup.thumb', function () {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });

    });
};


var trackIndex = function (album, song) {
    return album.songs.indexOf(song);
};
var updatePlayerBarSong = function () {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};
var nextSong = function () {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = $(getSongNumberCell(currentlyPlayingSongNumber));
    var $lastSongNumberCell = $(getSongNumberCell(lastSongNumber));
    //  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    //  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function () {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    // Update the Player Bar information
    updatePlayerBarSong();

    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $previousSongNumberCell = $(getSongNumberCell(currentlyPlayingSongNumber));
    var $lastSongNumberCell = $(getSongNumberCell(lastSongNumber));
    //Below has been replaced by above:
    // var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    // var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};
// toggelePlayFromPlayerBar sets the player to pause or play
var togglePlayFromPlayerBar = function () {
    var $playSongNumberCell = $(getSongNumberCell(currentlyPlayingSongNumber));
    if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
        $playSongNumberCell.html(pauseButtonTemplate);




    } else if (currentSoundFile) {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
       
        $playSongNumberCell.html(playButtonTemplate);


    }


};


// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAblbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $playAndPause = $('.main-controls .play-pause');
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');



$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playAndPause.click(togglePlayFromPlayerBar);



});