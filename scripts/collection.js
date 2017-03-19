//You can take this file and run it on pages without hardcoding it in the page
//This will Generate our Albums Templates
var collectionItemTemplate =
     '<div class="collection-album-container column fourth">'
   + '  <img src="assets/images/album_covers/01.png"/>'
   + '  <div class="collection-album-info caption">'
   + '    <p>'
   + '      <a class="album-name" href="album.html"> The Colors </a>'
   + '      <br/>'
   + '      <a href="album.html"> Pablo Picasso </a>'
   + '      <br/>'
   + '      X songs'
   + '      <br/>'
   + '    </p>'
   + '  </div>'
   + '</div>'
   ;

//You can display as many items as you want to on a given page without hard coding it 
window.onload = function() {
     // #1 This will load on startup
     var collectionContainer = document.getElementsByClassName('album-covers')[0];
     // #2 This will grab all of our 'album-covers' classes on the collections.html page
     collectionContainer.innerHTML = '';
 
     // #3 After we grab the class we will set the variable container to be empty so i can
    //hold our collections Templates above(1-16)
     for (var i = 0; i < 12; i++) {
         collectionContainer.innerHTML += collectionItemTemplate;
     }
 }