/**
 * Created by nowle on 3/4/2017.
 */
function powersOfTwo(n) {
    var powerArray = [];
    for (var i = 0; i <= n; i++) {
     /*console.log(Math.pow(2,i));*/
        powerArray.push(Math.pow(2, i));
    }
    console.log(powerArray);
    /*return [];*/
}

powersOfTwo(8);



function powersOfToo(n) {
    for (var i = 0; i <= n; i++) {
        return Math.pow(n, 2);
    }


}
console.log(powersOfToo(8));