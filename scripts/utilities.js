function forEach(arry, callbackFunc){
    
   var points = document.getElementsByClassName('point');
    
      for(var i = 0; i< points.length; i++){
          callbackFunc(arry[i]);
          
      }
  
}