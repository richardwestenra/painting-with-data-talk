function startInterval(callback, t){
  interval = setInterval(callback, t);
}

function stopInterval(){
  clearInterval(interval);
}

function getRandomNumber(max) {
  return Math.ceil( Math.random() * max );
}

function getRandomData(max, len){
  var arr = [];
  for (var i=0; i<len; i++) {
    arr.push( getRandomNumber(max) );
  }
  return arr;
}