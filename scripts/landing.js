// var pointsArray = document.getElementsByClassName('point');

 /**var animatePoints = function (points) {
     forEach(points, revealPoint);
 };
**/
var animatePoints = function() {
    
    var revealPoint = function() {
         // #7
         $(this).css({
             opacity: 1,
             transform: 'scaleX(1) translateY(0)'
         });
    };
    
    $.each($('.point'), revealPoint);
 };
/** var revealPoint = function (point) {
     point.style.opacity = 1;
     point.style.transform = "scaleX(1) translateY(0)";
     point.style.msTransform = "scaleX(1) translateY(0)";
     point.style.WebkitTransform = "scaleX(1) translateY(0)";

 }; **/


 $(window).load(function() {
     // Automatically animate the points on a tall screen where scrolling can't trigger the animation
      if($(window).height() > 950){
         animatePoints();
     }
     /** var sellingPoints = document.getElementsByClassName('selling-points')[0];
     var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
      refactoring */
     var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

   //  window.addEventListener('scroll', function (event) {
          $(window).scroll(function(event) {
       /**  if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
             animatePoints(pointsArray); **/
                if($(window).scrollTop() >= scrollDistance) {
             animatePoints();
         }
     });
                
                });