function Adjectives(){
  let interval,
    i = 0;

  const words = ['delightful','dank','diabolical','daffy','dubious','desirable','delicious','dependable','docile','dramatic','diverse','dreamy','deluxe','deceitful','disruptive','dauntless','deft','dynamic','dainty','decisive','dazzling','dastardly','decent','decorative','decadent','dicey'];

  const el = d3.select('#adjective');

  function getNewAdjective() {
    var word = words[i++];
    el.text(word);
    if (i>=words.length) {
      i = 0;
    }
  }

  this.start = function() {
    interval = window.setInterval(getNewAdjective, 500);
  };

  this.stop = function() {
    window.clearInterval(interval);
  };
}
