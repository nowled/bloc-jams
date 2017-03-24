var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {
            title: 'Blue',
            duration: '4:26'
        },
        {
            title: 'Green',
            duration: '3:14'
        },
        {
            title: 'Red',
            duration: '5:01'
        },
        {
            title: 'Pink',
            duration: '3:21'
        },
        {
            title: 'Magenta',
            duration: '2:15'
        }
     ]
};

// Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        {
            title: 'Hello, Operator?',
            duration: '1:01'
        },
        {
            title: 'Ring, ring, ring',
            duration: '5:01'
        },
        {
            title: 'Fits in your pocket',
            duration: '3:21'
        },
        {
            title: 'Can you hear me now?',
            duration: '3:14'
        },
        {
            title: 'Wrong phone number',
            duration: '2:15'
        }
     ]
};

var albumCherrryBlossoms = {
    title: 'Osaka',
    artist: 'Osaka Joe',
    label: 'Kansai',
    year: '1880',
    albumArtUrl: 'assets/images/album_covers/04.png',
    songs: [
        {
            title: 'Hey there!',
            duration: '1:01'
        },
        {
            title: 'More Love',
            duration: '9:0'
        },
        {
            title: 'Indifference Is The Way',
            duration: '3:40'
        },
        {
            title: 'Spiritual Dark-ages',
            duration: '6:66'
        },
        {
            title: 'Sufism vs Stoicism',
            duration: '3:13'
        }
     ]
};

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">' + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' + '  <td class="song-item-title">' + songName + '</td>' + '  <td class="song-item-duration">' + songLength + '</td>' + '</tr>';

    return template;
};


//I put the albums in a global scope so I can access the album image on
//windows onload where I will put my event listener
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

//Here set values to each part of the album
var setCurrentAlbum = function (album) {
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

    // clear list of album song list container
    albumSongList.innerHTML = '';

    // Build List of Songs from Album
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

/**
 * We need to find the parent element
 * of a specified className--- and we will pass it a  specific classname
 * 
 */
var findParentByClassName = function (element, targetClass) {
    //if this is true!  Meaning an element,  do following
    if (!element.parentElement) {
        console.log("No Parent found");
    } else if (!element.parentElement.targetClass) {
        console.log("No parent found with that class name");
    } else{
        /**
         * our currentParent variable will be used to hold the elements's parent
         * that we passed
         */
        var currentParent = element.parentElement;
        /** We want to change the innerHtml of some Parent element
         * with the song-item number class
        not the parent or child of the song-item-number element itself because we are not trying to change the number or innerHtml
         of the song-item-number,title, or duration/ but we need to change either the pause button, rollover etc.., */
        while (currentParent.className !== targetClass && currentParent.className !== null) {
            /**Okay we found a match
             * of the Parent element of given class name so we will assign it to
             * our currentParent object and exit the WHILE LOOP
             */
            currentParent = currentParent.parentElement;
        }
        return currentParent;
    }
};
var getSongItem = function (element) {
    switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
        return findParentByClassName(element, 'song-item-number');
    case 'album-view-song-item':
        return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
        return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
        return element;
    default:
        return;
    }
};
var clickHandler = function (targetElement) {
    var songItem = getSongItem(targetElement);
    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        //why get attribute and how do you make attribute
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;

        //If the current playing song is not the song playing
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }

};
// Elements to which we'll be adding listeners
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');


// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;


window.onload = function () {
    setCurrentAlbum(albumPicasso);

    songListContainer.addEventListener('mouseover', function (event) {

        // Only target individual song rows during event delegation
        if (event.target.parentElement.className === 'album-view-song-item') {
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
            var songItem = getSongItem(event.target);

            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }

        }
    });

    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function (event) {
            // Selects first child element, which is the song-item-number element
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });
        songRows[i].addEventListener('click', function (event) {
            // Event handler call
            clickHandler(event.target);
            // Store state of playing songs line 180
        });
    }

    var albums = [albumPicasso, albumMarconi, albumCherrryBlossoms];
    var index = 1;

    albumImage.addEventListener("click", function (event) {
        setCurrentAlbum(albums[index]);
        index++;
        if (index == albums.length) {
            index = 0;
        }
    });
};